import { Innertest } from "innertest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const innertest = new Innertest({ id: "quickcart-next" });

// Innertest function to save user data to a database
export const syncUserCreation = innertest.createFunction(
    {
        id: 'sync-user-from-clerk',
    },
    async (event) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + " " + last_name,
            imageUrl: image_url,
        }
        await connectDB()
        await User.create(userData);
    }
);

// Innertest Function to update user data in database
export const syncUserUpdation = innertest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    { event: 'clerk/user.updated' },
    async (event) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            email: email_addresses[0].email_address,
            name: first_name + " " + last_name,
            imageUrl: image_url,
        }
        await connectDB()
        await User.findByIdAndUpdate(id, userData)
    }
)


// Innertest Function to delete user from database
export const syncUserDeletion = innertest.createFunction(
    {
        id: 'delete-user-with-clerk'
    },
    { event: 'clerk/user.deleted' },
    async (event) => {
        const { id } = event.data

        await connectDB()
        await User.findByIdAndDelete(id)
    }
)

