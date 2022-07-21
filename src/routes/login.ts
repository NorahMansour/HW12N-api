import { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "bson";
import { userInfo } from "os";
import { prismaClient } from "../prisma";
import { REPL_MODE_SLOPPY } from "repl";
import { result } from "lodash";
import user from "./user";
//import bcrypt for "bcrypt";
//import 


const LoginBody = Type.Object({
  email: Type.String({ format: "email" }),//({ format: "email" }),
  password: Type.String(),
});
type LoginBody = Static<typeof LoginBody>;
//export const tokens: string[] = [];
//export const tokenUsers: { [token: string]: string } = {};
export default async function (server: FastifyInstance) {
  server.route({
    method: "POST",
    url: "/login",
    schema: {
      summary: "Login a user and returns a token",
      tags:['login'],
      body: LoginBody,
    },
    handler: async (request, reply) => {
      const {email,password} = request.body as LoginBody;

     const user= await prismaClient.user.findFirst({
      where :{

        email:email,
        //password :password,
      },
     });
     if (!user){
  const result =await prismaClient.user.create({
    data:{
      email:email,
      password:email,
      name:'',
    },
  });
  const token = server.jwt.sign({
      user_id:result.user_id,
      email:result.email,
      name :result.name,
       role: 'admin'});
return{
id: result.user_id,
token,
//Type:'SignUp',
} ;
    }else{
      if (user.password!==password){
        reply.unauthorized();
        return;    
        }
        const token = server.jwt.sign({
          id: user.user_id,
					email: user.email,
					name: user.name,
					role: 'admin',
        
        });
        return {
					id: user.user_id,
					token,
					type: 'SignIn',
				};
			}
		},
	});
}

    


 


  


