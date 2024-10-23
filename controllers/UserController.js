const User = require('../models/Users');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const UnverifiedUser = require('../models/UnverifiedUser');
const Otp = require('../models/Otp');

function generateConditionedOtp() {
    let number;
    do {
        number = Math.floor(1000 + Math.random() * 9000);
    } while (number % 4 !== 0)
        return number;
}

exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Provide all details'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered with us"
            });
        }

        // const resultant_otp = generateConditionedOtp();
        // console.log(resultant_otp);

        const verificatin_code = generateConditionedOtp();
        console.log(`Generated Verification Code: ${verificatin_code}`);

        // const transporter = nodemailer.createTransport({
        //     host: 'smtp.gmail.com',
        //     port: 587,
        //     secure: false,
        //     auth: { user: 'fortune.solutionpoint@gmail.com', pass: 'rsyh xzdk cfgo vdak' }

        // });

        // const mailOptions = {
        //     from: 'fortune.solutionpoint@gmail.com',
        //     to: email,
        //     subject: 'Email Verification Code',
        //     text: `Your verification code is ${verificatin_code}`
        // };

        // await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to: ${email}`);

        const newUser = await UnverifiedUser.create({
            firstName,
            lastName,
            email,
            password,
            verificatin_code,  
            is_verified: false   
        });

        return res.status(200).json({
            success: true,
            message: 'User created Successfully',
            data: newUser
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
    if(!email || !password) {
        return res.status(200).json({
            success: false,
            message: 'Email or Password is not provided'
        });
    }
    const user = await User.findOne({email}).select('+password');
    console.log(user);
    if(!user) {
        return res.status(200).json({
            success: false,
            message: "User not found",
        });
    }
    const isPasswordMatched = user.comparePassword(password);
    if(!isPasswordMatched) {
        return res.status(200).json({
            success: false,
            message: 'Password not matched',
        });
    }
    return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        user: user
    });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}


exports.verifyUserOtp = async(req, res) => {
    try {
        const {userId} = req.params;
        const unverifiedUser = await UnverifiedUser.findOne({userId}).select('verificatin_code');

        if(!unverifiedUser) {
            return res.status(200).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User found successfully',
            data: unverifiedUser
        });
        

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}


exports.createAuthUser = async (req, res) => {
    try {
        const {id} = req.params;
        const response = await UnverifiedUser.findById(id);
        if(!id) {
            return res.status(500).json({
                success: false,
                message: "User Id not given"
            });
        }

        if(!response) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log(response);

        const unverifiedUser = await UnverifiedUser.findById(id)
        unverifiedUser.is_verified = true;
        unverifiedUser.save();

       const newUser = await User.create({
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        password: response.password
       });

        return res.status(200).json({
            success: true,
            message: "User found",
            data: newUser
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}


exports.getUserById = async (req, res) => {
    try {
        const {id} = req.params;
        console.log(id);
        const user = await User.findById(id);
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })  
        }
        console.log(user);
        return res.status(200).json({
            success: true,
            message: 'Find User',
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        })        
    }
}

exports.resetUserPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});

        if(!user) {
            return res.status(500).json({
                success: false,
                message: 'User not found'
            });
        }

        const verification_code = generateConditionedOtp();
        const userId = user._id;


        const result = await Otp.create({verification_code, userId});
        if(!result) {
            return res.status(500).json({
                success: false,
                message: 'Something wrong happed while getting otp'
            });
        }


        // const transporter = nodemailer.createTransport({
        //     host: 'smtp.gmail.com',
        //     port: 587,
        //     secure: false,
        //     auth: { user: 'fortune.solutionpoint@gmail.com', pass: 'rsyh xzdk cfgo vdak' }

        // });

        // const mailOptions = {
        //     from: 'fortune.solutionpoint@gmail.com',
        //     to: email,
        //     subject: 'Email Verification Code',
        //     text: `Your verification code is ${verification_code}`
        // };

        // await transporter.sendMail(mailOptions);
        return res.status(200).json({
            success: true,
            message: 'its working'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

exports.verifyForgetPasswordOtp = async (req, res) => {
    try {
        const {email, otp} = req.body;
        console.log(req.body);
        const user = await User.findOne({email});
        if(!user) {
            return res.status(500).json({
                success: false,
                message: 'We did for you'
            });
        }
        const serverOtp = await Otp.findOne({userId: user._id})


        if(parseInt(serverOtp.verification_code) === parseInt(otp)){
            return res.status(200).json({
                success: true,
                message: 'Otp verified successfully'
            });
        }

        return res.status(400).json({
            success: false,
            message: 'Incorrect Otp',
            data: user
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

exports.updateUserPassword = async (req, res) => {
    try {
        const {email, newPassword} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        user.password = newPassword;
        user.save();
        return res.status(200).json({
            success: true,
            message: 'password updated successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}