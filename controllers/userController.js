const express = require("express");
const userServices = require("../services/userServices");
const bcrypt = require("bcrypt");


const crypto = require("crypto");
const router = express.Router();

let userController = {};

userController.userSignInPost = async (req, res) => {
  try {
    //   console.log('authh',req.headers.authorization)
    console.log("its working user sign post");
    console.log("reached login post:", req.body);
    const { email, password } = req.body;

    const result = await userServices.userSignInPost(email, password);

    res.status(result.status).json({ message: result.message ,userToken:result.token});
  } catch (error) {
    console.log("An error occured at login", error.message);
    res.status(500).json({ info: "An error occured" });
  }
};

userController.userSignUpPost = async (req, res) => {
  try {
    console.log("its working user sign up");
    console.log("reached sign up controller:", req.body);
   
    const userData = req.body;
    const result = await userServices.userSignUp(userData);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.log("An error occured at login", error.message);
    res.status(500).json({ info: "An error occured" });
  }
};

userController.fetchUser = async (req, res) => {
  try {
      const user = req.user
      console.log('requested user in controller:',user);
      res.status(200).json({ user:user })
  } catch (error) {
      console.log("An error occured at fetch User", error.message);
      res.status(500).json({ info: 'An error occured' })
  }

}

userController.editProfile = async (req, res) => {
  try {
    console.log("its working user edit profile");
const user = req.user
const userId = user.id
    const userData = req.body;
    const result = await userServices.userEditProfile(userData,userId);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.log("An error occured at login", error.message);
    res.status(500).json({ info: "An error occured" });
  }
};

userController.editPassword = async (req, res) => {
  try {
    console.log("its working user edit password");
const user = req.user
const userId = user.id
 const {newPassword,currentPassword} = req.body
    const result = await userServices.userEditPassword(newPassword,currentPassword,userId);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.log("An error occured at login", error.message);
    res.status(500).json({ info: "An error occured" });
  }
};

userController.addNewArticle = async (req, res) => {
  try {
    console.log("its working user add new article");
const user = req.user
const userId = user.id
const articleData = req.body;
    const result = await userServices.addNewArticle(articleData,userId);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.log("An error occured at article posting in controller", error.message);
    res.status(500).json({ info: "An error occured" });
  }
};

userController.fetchArticles = async (req, res) => {
  try {
    console.log("its working user controller fetch user articles");
const user = req.user
const userId = user.id
    const result = await userServices.fetchArticles(userId);
    res.status(result.status).json({ articles:result.articles,user:user });
  } catch (error) {
    console.log("An error occured at article posting in controller", error.message);
    res.status(500).json({ info: "An error occured" });
  }
};

userController.getUserLists = async (req, res) => {
  try {
    console.log("its working user controller fetch user lists");
const user = req.user
const userId = user.id
    const result = await userServices.fetchUserLists(userId);
    res.status(result.status).json({ articles: result.articles ,user:user});
  } catch (error) {
    console.log("An error occured at article posting in controller", error.message);
    res.status(500).json({ info: "An error occured" });
  }
};

userController.editArticle = async (req, res) => {
  try {
    console.log("its working user edit article");
const user = req.user
const userId = user.id
const articleData = req.body;
const {articleId} = req.body;
console.log('article id,',articleId);
    const result = await userServices.editArticle(articleData,userId,articleId);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.log("An error occured at article posting in controller", error.message);
    res.status(500).json({ info: "An error occured" });
  }
};

userController.deleteArticle = async (req, res) => {
  try {
    console.log("its working user delete article");
const user = req.user
const userId = user.id
const {userData} = req.body;
const {articleId} = userData;
console.log('artilce id,',articleId);
    const result = await userServices.deleteArticle(userId,articleId);
    res.status(result.status).json({ message: result.message,success:result.success });
  } catch (error) {
    console.log("An error occured at article posting in controller", error.message);
    res.status(500).json({ info: "An error occured" });
  }
};

module.exports = userController;
