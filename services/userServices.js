const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const { generateToken } = require("../config/jwt");
const Article = require('../models/articleModel');
const cloudinary = require('../config/cloudinary')

let userServices = {};

userServices.userSignInPost = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { status: 404, message: "User not exist, Please signup" };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { status: 404, message: "Please enter correct password" };
    }

    const token = await generateToken(user._id);
    if (!token) {
      console.log("no token get in user service");
    }

    return {
      status: 200,
      message: "Login successful",
      token: token,
    };
  } catch (error) {
    console.log("An error occured at login", error.message);
    res.status(500).json({ info: "An error occured in sign in services" });
  }
};

userServices.userSignUp = async (userData) => {
  try {
    console.log("user data in services", userData);

    const {
      firstName,
      lastName,
      phone,
      email,
      dob,
      password,
      articlePreferences,
    } = userData;
    const user = await User.findOne({ email });
    if (user) {
      return {
        status: 401,
        message: "User already exist, Please try with another email",
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      phone,
      email,
      dob,
      password: hashedPassword,
      articlePreferences,
    });
    await newUser.save();
    return { status: 200, message: "Sign-up succesfull" };
  } catch (error) {
    console.log("An error occured at sign up", error.message);
    res.status(500).json({ info: "An error occured in sign in services" });
  }
};

userServices.userEditProfile = async (userData, userId) => {
  try {
    console.log("user id for editing profile in user services", userId);
    console.log("edited user data in services", userData);

    const { firstName, lastName, phone, email, articlePreferences } = userData;
    const user = await User.findById(userId);
    const existingEmail = await User.findOne({ email });

    if (existingEmail && user.email != email) {
      return { status: 409, message: "Email already taken" };
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.email = email;
    user.articlePreferences = articlePreferences;
    await user.save();
    return { status: 200, message: "Profile updated successfully" };
  } catch (error) {
    console.log("An error occured at sign up", error.message);
    res.status(500).json({ info: "An error occured in edit profile services" });
  }
};

userServices.userEditPassword = async (
  newPassword,
  currentPassword,
  userId
) => {
  try {
    console.log("edited new password data in services", newPassword);

    const user = await User.findById(userId);
    if (!user) {
      return { status: 404, message: "User not found" };
    }
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return { status: 404, message: "Your current password is incorrect" };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();
    return { status: 200, message: "Password updated successfully" };
  } catch (error) {
    console.log("An error occured at Password edit", error.message);
    res.status(500).json({ info: "An error occured in sign in services" });
  }
};


userServices.addNewArticle = async (
 articleData,userId
  ) => {
    try {
        const  {
            articleName,
            tags,
            selectedCategory,
            description,
            image
          } = articleData
  
      const user = await User.findById(userId);
      if (!user) {
        return { status: 404, message: "User not found" };
      }
    
        const result = await cloudinary.uploader.upload(image, {
          folder: "articles",
        });

const newArticle =  new Article({
    name:articleName,
    tags,
    category:selectedCategory,
    description,
    image: result.secure_url,
    author:user._id
})
      await newArticle.save();

      user.articles.push(newArticle._id);
      user.save();
      return { status: 200, message: "Article Uploaded successfully"};
    } catch (error) {
      console.log("An error occured at Article posting", error.message);
      res.status(500).json({ info: "An error occured in article posting services" });
    }
  };


  userServices.fetchArticles = async (
    userId
  ) => {
    try {

      const user = await User.findById(userId);
      if (!user) {
        return { status: 404, message: "User not found" };
      }

      const articles = await Article.find({
        category:{$in:user.articlePreferences}
      }).sort({ createdAt: -1 });


      return { status: 200, articles: articles, message: "Articles fetched successfully" };
    } catch (error) {
      console.log("An error occured at Password edit", error.message);
      res.status(500).json({ info: "An error occured in sign in services" });
    }
  };

  userServices.fetchUserLists = async (
    userId
  ) => {
    try {

      const user = await User.findById(userId);
      if (!user) {
        return { status: 404, message: "User not found" };
      }

      const articles = await Article.find({
      author:user._id
      }).sort({ createdAt: -1 });


      return { status: 200, articles: articles, message: "Articles fetched successfully" };
    } catch (error) {
      console.log("An error occured at fetching user lists", error.message);
      res.status(500).json({ info: "An error occured in fetching user lists in services" });
    }
  };


  userServices.editArticle = async (
    articleData,userId,articleId
     ) => {
       try {
           const  {
               articleName,
               tags,
               selectedCategory,
               description,
               image
             } = articleData
     
         const user = await User.findById(userId);
         if (!user) {
           return { status: 404, message: "User not found" };
         }
       let result;
         if(image){
             result = await cloudinary.uploader.upload(image, {
                folder: "articles",
              });
         }

         const article = await Article.findById(articleId);

         if(!article){
            return { status: 404, message: "Article not found" };
         }

         article.name = articleName;
         article.tags = tags;
         article.category = selectedCategory;
         article.description = description;

         if(image){
            article.image = result.secure_url
         }

         article.save();
    
         return { status: 200, message: "Article Uploaded successfully"};
       } catch (error) {
         console.log("An error occured at Article posting", error.message);
         res.status(500).json({ info: "An error occured in article posting services" });
       }
     };


     userServices.deleteArticle = async (
       userId,articleId
         ) => {
           try {
      
             const user = await User.findByIdAndUpdate(userId,{
                $pull:{articles:articleId}
             },{new:true})
             if (!user) {
               return { status: 404, message: "User not found",success:false };
             }
             
             const article = await Article.findByIdAndDelete(articleId);
    
             if(!article){
                return { status: 404, message: "Article not found" ,success:false};
             }
    
             return { status: 200, message: "Article deleted successfully",success:true};
           } catch (error) {
             console.log("An error occured at Article posting", error.message);
             res.status(500).json({ info: "An error occured in article posting services" });
           }
         };

module.exports = userServices;
