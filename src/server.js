const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const cookieParser = require('cookie-parser');
const connectDB = require('../src/config/dbConnect');    
const authRoutes = require('./modules/auth/auth.route');
const chUserRoutes = require('./modules/control-panel/user/user.route'); 
const chProductRoutes = require('./modules/control-panel/product/product.route');
const chBlogRoutes = require('./modules/control-panel/blog/blog.route');
const chCategoryRoutes = require('./modules/control-panel/category/category.route');
const chCouponRoutes = require('./modules/control-panel/coupon/coupon.route');
const chOrderRoutes = require('./modules/control-panel/order/order.route');
const waProductRoutes = require('./modules/web-app/product/product.route');
const waBlogRoutes = require('./modules/web-app/blog/blog.route');
const waCategoryRoutes = require('./modules/web-app/category/category.route');
const waOrderRoutes = require('./modules/web-app/order/order.route');
const waPaymentRoutes = require('./modules/web-app/payment/payment.route');
const {authMiddleware,isAdmin} = require('../src/middleware/authMiddleware');  
connectDB();


app.use(bodyParser.json());
app.use(cookieParser());

/* authentication related routes  */
app.use('/api/auth', authRoutes);                                      

 /* control hub  related routes  */
app.use('/api/ch/users', authMiddleware,isAdmin,chUserRoutes);            
app.use('/api/ch/products', authMiddleware,isAdmin,chProductRoutes);   
app.use('/api/ch/blogs', authMiddleware,isAdmin,chBlogRoutes);  
app.use('/api/ch/category', authMiddleware,isAdmin,chCategoryRoutes);    
app.use('/api/ch/coupon', authMiddleware,isAdmin,chCouponRoutes); 
app.use('/api/ch/order', authMiddleware,isAdmin,chOrderRoutes); 


 /* web app  related routes  */         
 app.use('/api/wa/products',waProductRoutes);    
 app.use('/api/wa/blogs',waBlogRoutes);   
 app.use('/api/wa/category',waCategoryRoutes);  
 app.use('/api/wa/order',waOrderRoutes); 
 app.use('/api/wa/payment',waPaymentRoutes); 

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            status: err.status || 500,
            message: err.message || 'Internal Server Error dfdf',
            stack: err.stack,
        },
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
