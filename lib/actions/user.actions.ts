/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { clerkClient } from "@clerk/nextjs/server"
import { parseStringify } from "../utils"
import { liveblocks } from "../liveblocks"
import { cache } from "react"

export const getClerkUsers = cache(async ({userIds}: {userIds: string[]}) => {

    // Validation: Check if userIds is empty or invalid
    if (!userIds || userIds.length === 0) {
        console.log('No userIds provided to getClerkUsers');
        return parseStringify([]);
    }

    // Filter out empty/invalid email addresses
    const validUserIds = userIds.filter(id => id && typeof id === 'string' && id.trim().length > 0);
    
    if (validUserIds.length === 0) {
        console.log('No valid userIds provided to getClerkUsers');
        return parseStringify([]);
    }

    try{
        console.log(`Fetching ${validUserIds.length} users from Clerk API...`);

        const client = await clerkClient();
        const { data } = await client.users.getUserList({
            emailAddress: userIds
        })

        if (!data || data.length === 0) {
            console.log('No users found in Clerk API response');
            return parseStringify([]);
        }

        console.log(`Successfully fetched ${data.length} users from Clerk API`);
        console.log('User data:', data);

         
        // this is to ensure that the user data is in the format we want wjich is an array of objects with id, name, email and avatar properties
        const users = data.map((user: any) => ({
            id: user.id,
            // name: `${user.firstName} ${user.lastName}`,
            name:  user?.fullName || [user?.firstName, user?.lastName]
                    .filter(Boolean)
                    .join(' ') || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || "User",
            email: user.emailAddresses[0]?.emailAddress || '',
            avatar: user.imageUrl || '',
        }))

         
        // to make sure the users are sorted in the same order as userIds
        const sortedUsers = userIds.map((email) => users.find((user: any) => user.email === email));
        return parseStringify(sortedUsers);
    }
    catch(error: any){
        // More specific error handling
        let errorMessage = 'Unknown error occurred while fetching users';
        let errorDetails = '';

        if (error.name === 'TypeError' && error.message.includes('fetch failed')) {
            errorMessage = 'Network error: Failed to connect to Clerk API';
            errorDetails = 'Check your internet connection and Clerk API status';
        } else if (error.status === 401) {
            errorMessage = 'Authentication error: Invalid Clerk credentials';
            errorDetails = 'Check your CLERK_SECRET_KEY environment variable';
        } else if (error.status === 403) {
            errorMessage = 'Authorization error: Insufficient permissions';
            errorDetails = 'Check your Clerk API permissions and plan limits';
        } else if (error.status === 429) {
            errorMessage = 'Rate limit exceeded: Too many requests to Clerk API';
            errorDetails = 'Wait before making more requests or upgrade your Clerk plan';
        } else if (error.status >= 500) {
            errorMessage = 'Clerk API server error';
            errorDetails = 'This is likely a temporary issue with Clerk services';
        } else if (error.message) {
            errorMessage = `Clerk API error: ${error.message}`;
        }

        // Better logging with context
        console.error('Error occurred while fetching users:', {
            message: errorMessage,
            details: errorDetails,
            userIds: validUserIds,
            originalError: error.message || error,
            timestamp: new Date().toISOString()
        });

        // Return empty array instead of undefined
        return parseStringify([]);
    }
})

export const getDocumentUsers = async ({roomId, currentUser, text}: {roomId:string, currentUser: string, text: string}) => {
    try {
        const room =await liveblocks.getRoom(roomId);
        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

        if(text.length){
            const lowerCaseText = text.toLowerCase();
            const filteredUsers = users.filter((email: string) => email.toLowerCase().includes(lowerCaseText))

            return parseStringify(filteredUsers);
        }

        return parseStringify(users);
        
    } catch (error) {
        console.log(`Error fetching document users: ${error}`)
    }
}