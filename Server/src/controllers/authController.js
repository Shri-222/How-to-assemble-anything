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

    try {
        let isUserPresent = await User.findOne({email: email})

        if ( !isUserPresent ) {

            isUserPresent = new User({
                userName : userName,
                email : email,
                password : password,
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

    const isUserPresent = await User.findOne( { email : email } )

    if ( !isUserPresent ) return res.status(400).json({massage: 'User Is NOt Registered, Please Registered First '});

    if ( isUserPresent.password !== password ) return res.status(400).json({ massage : ' Incorrect Password '})

    return res.status(200).json(
        {
            massage : 'Login Success'
        }
    );

};



// token generator