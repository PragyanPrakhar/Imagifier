import Header from "@/components/shared/Header";
import React from "react";
import { transformationTypes } from "@/constants";
import TransformationForm from "@/components/shared/TransformationForm";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
// import { getUserById } from "@/services/userService"; // Adjust the import path as necessary
const AddTransformationTypePage = async ({
    params: { type },
}: SearchParamProps) => {
    const { userId } = await auth();
    const transformation = transformationTypes[type];
    if(!userId) redirect('/sign-in');
    const user = await getUserById(userId);
    return (
        <div>
            {/* AddTransformationTypePage */}
            <Header
                title={transformation.title}
                subtitle={transformation.subTitle}
            />
            <TransformationForm
                action="Add"
                userId={user._id}
                type={transformation.type as TransformationTypeKey}
                creditBalance={user.creditBalance}
            />
        </div>
    );
};

export default AddTransformationTypePage;
