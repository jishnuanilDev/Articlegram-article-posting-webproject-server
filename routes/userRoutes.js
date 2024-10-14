const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const userProtect = require('../middleware/userAuth')

userRouter.post('/sign-in',userController.userSignInPost);
userRouter.post('/sign-up',userController.userSignUpPost);
userRouter.get('/get-profile',userProtect,userController.fetchUser);
userRouter.put('/edit-profile',userProtect,userController.editProfile);
userRouter.put('/edit-password',userProtect,userController.editPassword);
userRouter.post('/add-new-article',userProtect,userController.addNewArticle);
userRouter.get('/get-articles',userProtect,userController.fetchArticles);
userRouter.get('/get-user-lists',userProtect,userController.getUserLists);
userRouter.put('/edit-article',userProtect,userController.editArticle);
userRouter.post('/delete-article',userProtect,userController.deleteArticle);


module.exports = userRouter;