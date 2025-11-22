
 // src/app/api/verifyToken/route.ts
 import { verifySessionToken } from "@/lib/firebase/admin";
export async function POST(request:Request) {
    try{
        const { token } = await request.json();
        if(!token){
            return new Response(JSON.stringify({error:"no token provided "}),{status:400});
        }
        const decodedToken = await verifySessionToken(token);
        return new Response (JSON.stringify({valid:true,uid:decodedToken.uid,email:decodedToken.email}),{status:200});
    }catch(error){
        return new Response (JSON.stringify({valid:false,error:(error as Error).message}),{status:401});
    }
}