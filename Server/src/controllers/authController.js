
import OTP from "../models/otp";
import User from "../models/User"


// registration controller
export default async function Registration(req, res) {

    const { userName, email, password, confirmPassword } = req.body

    if ( !userName || !email || !password || !confirmPassword ) {
        return res.status(400).json(
            {
                massage : " Please Provide All Filed Details "
            }
        )
    }

    if ( password !== confirmPassword ) {
        return res.status(400).json(
            {
                massage : " Password and Confirm Password Must Match "
            }
        )
    }

    const hashPassword = await bcrypt.hash(password, 10)

    try {
        let isUserPresent = await User.findOne({email: email})

        if ( !isUserPresent ) {

            const { otp } = req.body;

            const isOTPExits = await OTP.findOne({email}).sort({createdAt : -1}).limit(1).exec();

            if( !isOTPExits ) {
                return res.status(400).json({massage: 'OTP Not Found'});
            } else if ( isOTPExits.otp !== otp ) {
                return res.status(400).json({massage: 'Invalid OTP'}); 
            }

            isUserPresent = new User({
                userName : userName,
                email : email,
                password : hashPassword,
                // refresh_token : 
            })

            await isUserPresent.save();
            console.log('User Created Successfully ', isUserPresent);

        } else {
            return res.status(400).json(
                {
                    massage : 'User Already Exits, Please Login  '
                }
            )
        }

        return res.status(200).json(
            {
                massage : 'User Register Successfully'
            }
        )
        
    } catch (error) {
        return res.status(500).json(
            {
                massage: 'Error while Registration'
            }
        ) 
    }

};


// login controller

export default async function Login( { req, res} ) {

    const { email, password } = req.body;

    if (!email || !password ) {
        return res.status(400).json(
            {
                massage : ' Both Filed are Required '
            }
        )
    };

    const isUserPresent = await User.findOne( { email } ).select('+password')

    if ( !isUserPresent ) return res.status(400).json({massage: 'Invalid Email or Password'});

    if (  await bcrypt.compare(password, isUserPresent.password) ) {

        const payload = {
            email : isUserPresent.email,
            Id : isUserPresent.id,
        };

        const JWTToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn : '24h',
        })

        isUserPresent.Token = JWTToken;
        isUserPresent.password = undefined;

        const CookiesOptions = {
            httpOnly : true,
            secure : true,
            sameSite : 'none',
            path : '/',
            maxAge : 7 * 24 * 60 * 60 * 1000    // 7 Days Validation 
        };

        res.cookie( 
            'Session',
            JWTToken,
            CookiesOptions
        ).status(200).json({
            massage : 'User Logged In Successfully ',
            data : isUserPresent
        })
        
    } else {
                res.status(401).json(
                    {
                        success : false,
                        massege : 'Password is Incorrect, Please Enter Password Correctly',
                    }
                )
            }

    return res.status(200).json(
        {
            massage : 'Login Success'
        }
    );

};



// token generator