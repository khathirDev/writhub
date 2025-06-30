/* eslint-disable @typescript-eslint/no-explicit-any */
import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Document = async (props: any) => {
    const { params } = await props;
    const awaited_params = await params;
    const id = awaited_params.id;

  // Use Clerk's `auth` in server components
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Fetch user details from Clerk API
  const userRes = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
    },
    cache: "no-store",
  });

  if (!userRes.ok) {
    console.error("Failed to fetch Clerk user");
    redirect("/sign-in");
  }

  const clerkUser = await userRes.json();
  const email = clerkUser.email_addresses?.[0]?.email_address;

  const room = await getDocument({
    roomId: id,
    userId: email,
  });

  if (!room) redirect("/");

  const userIds = Object.keys(room.usersAccesses);
  const users = await getClerkUsers({ userIds });

 if (!users) {
    console.error("Failed to fetch users or users is not an array:", users);
    redirect("/");
  }

  const usersData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes("room:write")
      ? "editor"
      : "viewer",
  }));

  const currentUserType = room.usersAccesses[email]?.includes("room:write")
    ? "editor"
    : "viewer";

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default Document;



// import CollaborativeRoom from "@/components/CollaborativeRoom";
// import { getDocument } from "@/lib/actions/room.actions";
// import { getClerkUsers } from "@/lib/actions/user.actions";
// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// // import { Editor } from "@/components/editor/Editor";
// import React from "react";

// const Document = async ({ params }: { params: { id: string } }) => {
//     const id = params.id;
  

//   const clerkUser = await currentUser();
//   if(!clerkUser) redirect('/sign-in');
//   const room = await getDocument({
//     roomId: id,
//     userId: clerkUser.emailAddresses[0].emailAddress,
//   });

//   if(!room) redirect('/');

//   const userIds = Object.keys(room.usersAccesses);
//   const users = await getClerkUsers({userIds})

//   const usersData = users.map((user: User) => ({
//       ...user,
//       userType: room.usersAccesses[user.email]?.includes('room:write') ? 'editor' : 'viewer'

//   }))

//   const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write') ? 'editor' : 'viewer';

//   return (
  
//   <main className="flex w-full flex-col items-center">

//     <CollaborativeRoom
//         roomId={id}
//         roomMetadata={room.metadata}
//         users={usersData}
//         currentUserType={currentUserType}      
//         />
    
//   </main>
//   );
// };

// export default Document;
