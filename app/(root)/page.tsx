/* eslint-disable @typescript-eslint/no-explicit-any */

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import { headers } from "next/headers";
import { getDocuments } from "@/lib/actions/room.actions";
import Header from "@/components/Header";
import { SignedIn, UserButton } from "@clerk/nextjs";
import AddDocumentBtn from "@/components/AddDocumentBtn";
import Image from "next/image";
import Link from "next/link";
import { dateConverter } from "@/lib/utils";
import { DeleteModal } from "@/components/DeleteModal";
import Notifications from "@/components/Notifications";


const Home = async () => {

  const user = await currentUser();
  if (!user) redirect("/sign-in");

// Access email directly from user object
const email = user.emailAddresses?.[0]?.emailAddress;
  // const { userId } = await auth();
  // if (!userId) redirect("/sign-in");

  // // Fetch full user info via Clerk API
  // const res = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
  //   headers: {
  //     Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
  //   },
  //   cache: "no-store", // required for SSR freshness
  // });

  // if (!res.ok) throw new Error("Failed to fetch Clerk user");

  // const clerkUser = await res.json();
  // const email = clerkUser.email_addresses?.[0]?.email_address;

  const roomDocuments = await getDocuments(email);

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications/>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>

      {roomDocuments.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All documents</h3>
            <AddDocumentBtn userId={user.id} email={email} />
          </div>

          <ul className="document-ul">
            {roomDocuments.data.map(({ id, metadata, createdAt }: any) => (
              <li key={id} className="document-list-item">
                <Link href={`/documents/${id}`} className="flex flex-1 items-center gap-4">
                  <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                    <Image src="/assets/icons/doc.svg" alt="file" width={40} height={40} />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 text-lg">{metadata.title}</p>
                    <p className="text-sm font-light text-blue-100">
                      Created about {dateConverter(createdAt)}
                    </p>
                  </div>
                </Link>
                {/*na here we go put the delete button so we go fih fit delete documents wey no useful from our account */}
                <DeleteModal roomId={id}/>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="document-list-empty">
          <Image src="/assets/icons/doc.svg" alt="document" width={40} height={40} className="mx-auto" />
          <AddDocumentBtn userId={user.id} email={email} />
        </div>
      )}
    </main>
  );
};

export default Home;


// import React from "react";
// import Header from "@/components/Header";
// import { SignedIn, UserButton } from "@clerk/nextjs";
// import Image from "next/image";
// import AddDocumentBtn from "@/components/AddDocumentBtn";
// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { getDocuments } from "@/lib/actions/room.actions";
// import Link from "next/link";
// import { dateConverter } from "@/lib/utils";

// const Home = async () => {

//   const clerkUser = await currentUser();
//   if(!clerkUser) redirect('/sign-in')

// const roomDocuments = await getDocuments(clerkUser.emailAddresses[0].emailAddress);

//   return (
//     <main className="home-container">
//       <Header className="sticky left-0 top-0">
//         <div className="flex items-center gap-2 lg:gap-4">
//           Notification
//           <SignedIn>
//             <UserButton/>
//           </SignedIn>
//         </div>
//       </Header>

//       {roomDocuments.data.length > 0 ? (
        
//         <div className="document-list-container">
//           <div className="document-list-title">
//             <h3 className="text-28-semibold">All documents</h3>
//             <AddDocumentBtn userId={clerkUser.id} email={clerkUser.emailAddresses[0].emailAddress}/>
//           </div>

//           <ul className="document-ul">
//             {roomDocuments.data.map(({id, metadata, createdAt}: any) => (

//               <li key={id} className="document-list-item">
//                 <Link href={`/documents/${id}`} className="flex flex-1 items-center gap-4">
//                   <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
//                     <Image 
//                       src='/assets/icons/doc.svg'
//                       alt="file"
//                       width={40}
//                       height={40}
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <p className="line-clamp-1 text-lg">{metadata.title}</p>
//                     <p className="text-sm font-light text-blue-100">
//                       Created about {dateConverter(createdAt)}
//                       </p>
//                   </div>
//                 </Link>
//                 {/*add delete button*/}
//               </li>

//             ))}
//           </ul>

//         </div>
      
//       ) : (

//         <div className="document-list-empty">
//           <Image src="/assets/icons/doc.svg" alt="document" width={40} height={40} className="mx-auto"/>
//           <AddDocumentBtn userId={clerkUser.id} email={clerkUser.emailAddresses[0].emailAddress}/>
//         </div>


        

//       )}


//     </main>
//   );
// };

// export default Home;
