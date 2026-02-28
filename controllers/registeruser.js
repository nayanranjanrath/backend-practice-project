
const uploadoncloudinary = require("../middlewares/cloudeinary.middleware.js")
const jwt = require("jsonwebtoken")
const usermodel = require("../models/usermodel.js")
const gamesplayedmodel = require("../models/gamesplayedmodel.js")
const gamechatmodel =require ("../models/gamechat.model.js")
const recruitmentmodel = require("../models/recruitment.model.js")
const followersandfollowedtomodel = require("../models/followers.model.js")
const alliesmodel = require("../models/allais.model.js")
const postmodel = require("../models/postmodel.js")

const generateaccessandrefreshtokens = async (usreid) => {
  try {
    const user = await usermodel.findById(usreid)
    const accesstoken = await user.generateaccesstoken()
    const refreshtoken = await user.generaterefreshtoken()
    user.refreshtoken = refreshtoken

    await user.save({ validateBeforeSave: false })

    return { accesstoken, refreshtoken }
  }
  catch (error) {
    console.error(error)
    throw new Error("something wrong while generating ");


  }

}
const registeruser = async (req, res) => {
  try {

    console.log(">>> registerUser controller reached");
    const { username, email, fullname, password } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required"
      });
    }
    const existinguser = await usermodel.findOne(
      { $or: [{ email }, { username }] }
    )
    if (existinguser) {
      return res.status(300).json({
        success: "false",
        message: "user alrady exist",
      })
    }


    const avatarlocation = req.files?.avatar[0]?.path;
    const avatar = await uploadoncloudinary(avatarlocation)



    const user = new usermodel({ username, email, fullname, password, avatar: avatar?.url || "" })
    await user.save();

    res.status(200).json({
      message: "success",
      user
    });

  }
  catch (error) {
    console.error(error);
    return res.status(409).json({
      message: "Internal server error"
    });

  }
}
const loginuser = async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!(username || email)) {
      throw console.error("username or email is required")
      return res.status(400).json({
        success: false
      })
    }
    const user = await usermodel.findOne(
      { $or: [{ username }, { email }] }
    )
    if (!user) {
      console.log("user is new ");
      return res.status(400).json({ reson: "user need to login first " })

    }
    const ispasswordvalid = await user.ispasswordcorrect(password)
    if (!ispasswordvalid) {
      console.log("password is incorect");
      return res.status(400).json({ reson: "password is incorrect " })

    }
    const { accesstoken, refreshtoken } = await generateaccessandrefreshtokens(user._id)
    const option = {
      httpOnly: true, // Security: prevents frontend JS from reading the cookie
      secure: true

    }
    console.log(refreshtoken)
    return res.status(200).cookie("accesstoken", accesstoken, option).cookie("refreshtoken", refreshtoken, option).json({ success: true })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: "this is in catch part " })

  }

}
const logoutuser = async (req, res) => {
  try {
    usermodel.findByIdAndUpdate(req.user._id, { $set: { refreshtoken: undefined } }, { new: true })
    const option = {
      httpOnly: true, // Security: prevents frontend JS from reading the cookie
      secure: true

    }
    return res.status(200).clearCookie("accesstoken", option).clearCookie("refreshtoken", option).json({ success: true, reson: "user is successfilly loged out " })


  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, reson: "the logout user failed " })
  }

}
const refreshaccesstokenofuser = async (req, res) => {
  try {
    console.log("inside the controler")
    const incomingrefreshtoken = req.cookies?.refreshtoken || req.body.refreshtoken;
    if (!incomingrefreshtoken) {
      console.log("refres token is required ")
      return res.status(400).json({
        success: false,
        reson: "refresh token is not there "

      })
    }
    const decodedtoken = await jwt.verify(incomingrefreshtoken, "lahgjsdhgvajsghvshdvbalisa__lkjbfv")
    if (!decodedtoken) {
      console.log("decoding of token failed")
      console.log("refreshtoken is wrong")
      return res.status(400).json({
        success: false,
        reson: "the given refreshtoken is wrong "
      })
    }
    const user = await usermodel.findById(decodedtoken._id)
    if (!user) {
      console.log("invalid user")
      return res.status(400).json({
        success: false,
        reson: "user is invalid "
      })
    }
    // console.log(incomingrefreshtoken)
    // console.log(user?.refreshtoken)
    if (incomingrefreshtoken !== user?.refreshtoken) {

      console.log("refresh token not match with data base token")
      return res.status(400).json({ success: false, reson: "given refresh token not matche with the stored token " })

    }
    const { accesstoken, refreshtoken } = await generateaccessandrefreshtokens(user._id)
    const option = {
      httpOnly: true, // Security: prevents frontend JS from reading the cookie
      secure: true

    }
    return res.status(200).cookie("accesstoken", accesstoken, option).cookie("refreshtoken", refreshtoken, option).json({ success: true })


  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      reson: "you are in the catch block "
    })
  }


}
const getuserprofile = async (req, res) => {
  try {
    const { username } = req.params
    if (!username) {
      console.log("user name is required in url")
      return res.status(400).json({ success: false, reson: "the username  is not found  " })
    }
    const user = await usermodel.findOne({ username: username })

    const channel = await usermodel.aggregate([
      {
        $match: {
          username: username?.toLowerCase()//here we check for the data wher user name match 

        }
      },
      {
        $lookup: {
          from: "followersandfollowedtomodels",
          localField: "_id",
          foreignField: "channels",
          as: "followers"

        }
      },
      {
        $lookup: {
          from: "followersandfollowedtomodels",
          localField: "_id",
          foreignField: "follower",
          as: "followed"
        }
      },
      {
        $lookup: {
          from: "gamesplayedmodels",
          localField: "_id",
          foreignField: "user",
          as: "numofgamesplayed"
        }
      },
      {
        $addFields: {
          followerscount: { $size: { $ifNull: ["$followers", []] } },
          following: { $size: { $ifNull: ["$followed", []] } },
          numofgamesplayed: { $size: { $ifNull: ["$numofgamesplayed", []] } },
          isfollowed: {
            $cond: {
              if: { $in: [user._id, "$followers.follower"] },
              then: true,
              else: false
            }
          }
        }
      },
      {
        $project: {
          username: 1,
          followerscount: 1,
          following: 1,
          avatar: 1,
          fullname: 1,
          timestamps: 1,
          isfollowed: 1,
          numofgamesplayed: 1
        }
      }





    ])
    if (!channel?.length) {
      console.log("channel dont exist may be user name is wrong  ")
      return res.status(400).json({ success: false, reson: "may be the user name given is wrong " })

    }
    console.log("every thing is fine and our controllerb is working fine ")
    return res.status(200).json({ channel: channel[0] })

  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, reson: "you are in side the catch folder of controller " })

  }
}
const uploadpost = async (req, res) => {
  try {

    const { tittle, description } = req.body
    if (!tittle) {
      console.log("tittle is required ")
      return res.status(400).json({ success: false, reson: "tittle is required for posting " })
    }
    const postlocation = req.files?.postcontent[0]?.path;
    const postcontent = await uploadoncloudinary(postlocation)



    if (!postcontent || !tittle) {
      console.log("post and tittles are required")
      return res.status(400).json({ success: false, reson: "post and tittle is required " })
    }
    const post = new postmodel({ tittle, description, postcontent: postcontent?.url || "" })
    await post.save();
    return res.status(200).json({ success: true, reson: "post is successfully done ", url: post })


  } catch (error) {
    console.log("you are in the catch block")
    console.log(error)
    return res.status(400).json({ success: false, reson: "you are in side the catch block" })
  }


}
const myposts = async (req, res) => {
  try {
    const { username } = req.params
    if (!username) {
      console.log("user name is required in url")
      return res.status(400).json({ success: false, reson: "the username  is not found  " })
    }
    const user = await usermodel.findOne({ username: username })
    const posts = await usermodel.aggregate([
      {
        $match: {
          username: username?.toLowerCase()//here we check for the data wher user name match 

        }
      },
      {
        $lookup: {
          from: "postmodel",
          localField: "_id",
          foreignField: "postby",
          as: "posts"

        }
      },

      {
        $addFields: {
          posts: { $ifNull: ["$posts", []] }
        }

      },
      {
        $project: {
          username: 1,
          followerscount: 1,
          avatar: 1,
          post: 1,

          isfollowed: 1
        }
      }





    ])
    if (!posts) {
      console.log("therre are no posts you are in if satatement")
      return res.status(400).json({ success: false, reson: "there are no posts " })
    }
    console.log("every thing is fine and our controllerb is working fine ")
    return res.status(200).json({ posts: posts[0] })


  } catch (error) {
    console.log("you are inside the catch block")
    return res.status(500).json({ success: false, reson: "youn are inside the catch block" })
  }


}
const follow = async (req, res) => {
  try {
    const channelname = req.params;
    const username = req.body
    if (!channelname || !username) {
      console.log("user and channel is required for the follow ")
      return res.status(400).json({ success: false, reson: "user or channel is not there " })

    }
    if (channelname === username) {
      console.log("you can not follow youer self ")
      return res.status(400).json({ success: false, reson: "you cant follow your self " })
    }
    const user = await usermodel.findOne(username)
    const channel = await usermodel.findOne(channelname)
    const alredyfolllowed = await followersandfollowedtomodel.findOne({ follower: user, channels: channel })
    if (alredyfolllowed) {
      console.log("you alredy follow this channel")
      return res.status(400).json("you alredy follow this channel")
    }
    await followersandfollowedtomodel.create({ follower: user, channels: channel })
    console.log("saved the follower in data base")
    const ismutual = await followersandfollowedtomodel.findOne({ follower: channel, channels: user })
    if (ismutual) {
      console.log("you are mutual followers ")
      await alliesmodel.create({ allie1: user, allie2: channel })
      return res.status(200).json({ success: true, reson: "you are now allies " })
    }
    console.log("you are not allies ")
    return res.status(200).json({ success: true, reson: "you follwed successfully waiting for be an allie" })
  } catch (error) {
    console.log("youn are inside the catch block")
    console.log(error)
    return res.status(500).json({ success: false, reson: "you are inside the catch block " })
  }

}
const allieslist = async (req, res) => {
  try {
    const username = req.params
    if (!username) {
      console.log("username is required ")
      return res.status(400).json({ success: false, reson: "username is required which is missing " })
    }
    const user = await usermodel.findOne(username)
    if (!user) {
      console.log("invaliod user")
      return res.status(400).json({ success: false, reson: "user is invalid  " })
    }
    const allies = await alliesmodel.find({ $or: [{ allie1: user }, { allie2: user }] })
    if (!allies) {
      console.log("you dont have any allies ")
      return res.status(400).json({ success: false, reson: "you dont have any allies" })
    }
    console.log("every thing is fine and printing the allies list ")
    return res.status(200).json({ success: true, allieslist: allies })

  } catch (error) {
    console.log("you are inside the catch block ")
    console.log(error)
    return res.status(500).json({ success: false, reson: "you are in side the catch block " })
  }
}
const gamedetails = async (req, res) => {
  try {
    const username = req.params
    const user = await usermodel.findOne(username)
    if (!user) {
      console.log("invalid user")
      return res.status(400).json({ success: false, reson: "invalid user no data find of such user" })
    }



    const { gamename, numberoftimecompleated, platform, review, stars, gametags } = req.body;
    if (!gamename || !numberoftimecompleated || !stars || !gametags) {
      console.log("game name and stars and number of time played is required ")
      return res.status(400).json({ success: false, reson: "game name and stars and number of time played is required" })
    }
    const gamenamelower = gamename.trim().toLowerCase().replaceAll(" ", "")
    const gametaglower = gametags.map(tag => tag.trim().toLowerCase().replaceAll(" ", ""));
    const platformgeneral = platform.trim().toLowerCase().replaceAll(" ", "");
    const game = new gamesplayedmodel({ gamenamelower, numberoftimecompleated, platformgeneral, review, stars, user, gametaglower });
    await game.save();
    console.log("game details are saved ")
    return res.status(200).json({ success: true, reson: "game details are saved successfully " })


  } catch (error) {
    console.log("you are in side catch block ")
    console.log(error)
    return res.status(500).json({ success: false, reson: "you are in side the catch block" })

  }

}

const searchgames = async (req, res) => {
  try {
    const gamename = req.params.gamename
    if (!gamename) {
      console.log("gamename is required to find any details ")
      return res.status(400).json({ success: false, reson: "gamename is required to find any details " })
    }
    const rating = await gamesplayedmodel.aggregate([
      {
        $match: {
          $or: [
            { gamenamelower: gamename?.toLowerCase().replaceAll(" ", "").trim() },
            { gametaglower: gamename?.toLowerCase().replaceAll(" ", "").trim() }
          ]
        }

      },
      {
        $group: {
          _id: "$gamenamelower",
          averagestars: { $avg: "$stars" },
          totalRatings: { $sum: 1 }
        }

      }

    ])
    if (rating.length === 0) {
      console.log("there is no review of this game yet be the first to post review of this game  ")
      return res.status(200).json({ success: true, reson: "there is no review of this game yet be the first to post review of this game" })
    }

    console.log("game review is find in database")
    return res.status(200).json(
      rating.map(game => ({
        gamename: game._id,
        averageStars: Number(game.averagestars.toFixed(2)),
        totalRatings: game.totalRatings
      })))


  } catch (error) {
    console.log("you are inside the catch block ")
    console.log(error)
    return res.status(500).json({ success: false, reson: "you are inside the catch block " })
  }

}
const recruit = async (req, res) => {
  try {
    const recruiter = req.params
    const { platform, gamename, numofplayer, description } = req.body
    if (!recruiter || !gamename || !numofplayer) {
      console.log("recruter,gamename,numberof player are required to form a recruit requist")
      return res.status(400).json({ success: false, reson: "recruter,gamename,numberof player are required to form a recruit requist" })
    }
    const user = await usermodel.findOne(recruiter)
    if (!user) {
      console.log("user is invalid or not in our data so you can not make a requist")
      return res.status(400).json({ success: false, reson: "user is invalid or not in our data so you can not make a requist" })
    }
    const gamenamelower = gamename.trim().toLowerCase().replaceAll(" ", "")
    const platformgeneral = platform.trim().toLowerCase().replaceAll(" ", "")
    const recruitrequist = new recruitmentmodel({ platformgeneral, gamenamelower, numofplayer, description, recruiter: user, })
    await recruitrequist.save()
    const groupchat =new gamechatmodel({recruiter: user,gamename:gamenamelower})
    await groupchat.save()
    console.log("recruit requist is successfully saved")
    return res.status(200).json({ success: true, reson: "recruit requist is successfully saved" })
  } catch (error) {
    console.log("you are inside the catch block")
    console.log(error)
    return res.status(500).json({ success: false, reson: "you are inside the catch block" })
  }

}
const showrecruit = async (req, res) => {
  console.log("inside the controller showrecruit")
  try {
    const { gamename } = req.body
    if (gamename) {
      const gamenamelower = gamename.trim().toLowerCase().replaceAll(" ", "")
      const game = await recruitmentmodel.find({ gamenamelower: gamenamelower })
      if (game.length === 0) {
        console.log("no recruitment of this game is live ")
        return res.status(200).json({ success: true, reson: "no recruitment of this game is live" })
      }
      console.log("searched game recruitment is found ")
      console.log(game)
      return res.status(200).json({ success: true, reson: " recruitment of this game is live", game: game })
    }

    const game = await recruitmentmodel.find()
    console.log("all this games recruitment is live now")
    return res.status(200).json(game)

  } catch (error) {
    console.log("you are inside the catch block")
    console.log(error)
    return res.status(500).json({ success: false, reson: "you are inside the catch block" })
  }
}
const applyforrecruit = async (req, res) => {
  try {
    const { recruitment_id, username } = req.body

    if (!recruitment_id || !username) {
      console.log("recruitment id is required")

      return res.status(400).json("recruitment id is required ")
    }

    const user = await usermodel.findOne({ username: username })
const existingapplicant = await recruitmentmodel.findOne({_id:recruitment_id,applicant:user._id}) 
  if (existingapplicant) {
     console.log("alredy applied ")

      return res.status(400).json("alredy applied ")
  }



    const ok = await recruitmentmodel.findByIdAndUpdate(
      recruitment_id,
      { $push: { applicant: user } },
      { new: true }
    );
    if(!ok){
console.log("recruitmebt id is wrong ")

    return res.status(400).json("recruitmebt id is wrong  ")

    }
    console.log("successfully applied for the recruitment")

    return res.status(200).json("successfully applied for the recruitment ")


  } catch (error) {
    console.log("you are inside the catch block")
    console.log(error)
    return res.status(500).json("you are inside the catch block ")
  }

}

const showallaplicent =async(req,res)=>{
try {
const recruitername =req.body.recruitername
if(!recruitername){
console.log("recruiter is required for this ")
return res.status(400).json({success:false,reson:"recruiter is required for this"})
}
const recruiter =await usermodel.findOne({username:recruitername})
 if (!recruiter) {
   console.log("recruiter is invalid ")
 return res.status(400).json({success:false,reson:"recruiter is invalid"})
 }  
const gamerecruit = await recruitmentmodel.find({recruiter:recruiter._id}) .populate({
    path: "applicant",
    select: "username"   // only username field will be there 
  }).select("applicant")
if (gamerecruit.length===0) {
  console.log("no recruitment is made ")
return res.status(200).json({success:true,reson:"no recruitment is made"})

}
  console.log("applicant found")
return res.status(200).json({success:true,reson:"applicant found",applicant:gamerecruit})


} catch (error) {
  console.log("you are inside the catch block ")
console.log(error)
return res.status(500).json({success:false,reson:"you are inside the catch block "})
}

}
const selectplayer =async(req,res)=>{
  try {
    const {player_id,recrut_id} = req.body
    
if(!player_id||!recrut_id)
{console.log("player is required ")
    
    return res.status(400).json({success:false,reson:"player is required"})
}
const player = await recruitmentmodel.findOne({_id:recrut_id,applicant:{ $in: [player_id] }})
if (!player) {
  console.log("player or recruiter is not applied for any game")
    
   return res.status(200).json({success:false,reson:"player or recruiter is not applied for any game"})
}
console.log("--- SEARCH CRITERIA ---");
    console.log("Searching for Recruiter:", player.recruiter.toString());
    console.log("Searching for Game:", player.gamenamelower);
     console.log("Adding Player:", player.applicant);
const alredyselected =await gamechatmodel.findOne({recruiter:player.recruiter,gamename:player.gamenamelower,otherplayer:player.applicant})
if (alredyselected) {
   console.log("alredy selected  ")
    
    return res.status(400).json({success:false,reson:"alredy selected "})
}
const gamechatuser =await gamechatmodel.findOneAndUpdate({recruiter:player.recruiter.toString(),gamename:player.gamenamelower},   {$addToSet: { otherplayer: player_id } },
      { new: true,upsert: true })
        console.log(gamechatuser)
if (!gamechatuser) {
   console.log("No document matched!")
}
 console.log("player is in game chat ")
    
    return res.status(200).json({success:true,reson:"player is in game chat"})

  } catch (error) {
    console.log("you are inside the catch block ")
    console.log(error)
    return res.status(500).json({success:false,reson:"you are inside the catch block"})
  }
}
const removePlayerfromgroupchat= async (req, res) => {
  try {
    // recruiter_id is commented out for now until frontend auth is ready
    const { player_id, gamechat_id /*, recruiter_id*/ } = req.body;

    if (!player_id || !gamechat_id) {
      return res.status(400).json({ 
        success: false, 
        reason: "Player ID and GameChat ID are required" 
      });
    }

    // 1. Find the chat 
    // 2. Remove the player using $pull
    const updatedChat = await gamechatmodel.findOneAndUpdate(
      { 
        _id: gamechat_id, 
        // recruiter: recruiter_id // Uncomment this later for security
      },
      { 
        $pull: { otherplayer: player_id } 
      },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ 
        success: false, 
        reason: "Chat not found" 
      });
    }

    console.log(` Player ${player_id} removed successfully`);
    
    return res.status(200).json({ 
      success: true, 
      message: "Player removed successfully", 
      data: updatedChat 
    });

  } catch (error) {
    console.error("Remove Player Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = { registeruser, loginuser, logoutuser, refreshaccesstokenofuser, getuserprofile, uploadpost, myposts, follow, allieslist, gamedetails, searchgames, recruit, showrecruit, applyforrecruit,showallaplicent,selectplayer,removePlayerfromgroupchat}