// import Header from "@/components/shared/Header";
// import TransformationForm from "@/components/shared/TransformationForm";
// import { transformationTypes } from "@/constants";
// import { getUserById } from "@/lib/actions/user.actions";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// const AddTransformationTypePage = async ({
//     params: { type },
// }: SearchParamProps) => {
//     const { userId } = await auth();
//     const transformation = transformationTypes[type];

//     if (!userId) redirect("/sign-in");

//     const user = await getUserById(userId);

//     return (
//         <>
//             <Header
//                 title={transformation.title}
//                 subtitle={transformation.subTitle}
//             />

//             <section className="mt-10">
//                 <TransformationForm
//                     action="Add"
//                     userId={user._id}
//                     type={transformation.type as TransformationTypeKey}
//                     creditBalance={user.creditBalance}
//                 />
//             </section>
//         </>
//     );
// };

// export default AddTransformationTypePage;

// import Header from "@/components/shared/Header";
// import TransformationForm from "@/components/shared/TransformationForm";
// import { transformationTypes } from "@/constants";
// import { getUserById } from "@/lib/actions/user.actions";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// const AddTransformationTypePage = async (props:SearchParamProps) => {
//     const params=await props.params;
//     const type=params.type;
//     const { userId } = await auth();
//   if (!userId) redirect("/sign-in");
//   const transformation = transformationTypes[type];
//   const user = await getUserById(userId);

//   return (
//     <>
//       <Header title={transformation.title} subtitle={transformation.subTitle} />
//       <section className="mt-10">
//         <TransformationForm
//           action="Add"
//           userId={user._id}
//           type={transformation.type as TransformationTypeKey}
//           creditBalance={user.creditBalance}
//         />
//       </section>
//     </>
//   );
// };

// export default AddTransformationTypePage;

// import Header from "@/components/shared/Header";
// import TransformationForm from "@/components/shared/TransformationForm";
// import { transformationTypes } from "@/constants";
// import { getUserById } from "@/lib/actions/user.actions";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// const AddTransformationTypePage = async ({ params, searchParams }: SearchParamProps) => {
//     const { type } = params;

//     const { userId } = await auth();
//     if (!userId) redirect("/sign-in");

//     const transformation = transformationTypes[type];
//     if (!transformation) {
//         throw new Error(`Invalid transformation type: ${type}`);
//     }

//     const user = await getUserById(userId);

//     return (
//         <>
//             <Header
//                 title={transformation.title}
//                 subtitle={transformation.subTitle}
//             />
//             <section className="mt-10">
//                 <TransformationForm
//                     action="Add"
//                     userId={user._id}
//                     type={transformation.type as TransformationTypeKey}
//                     creditBalance={user.creditBalance}
//                 />
//             </section>
//         </>
//     );
// };

// export default AddTransformationTypePage;

import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const AddTransformationTypePage = async ({
    params,
    searchParams,
}: SearchParamProps) => {
    const resolvedParams = await params; // Await the promise
    const { type } = resolvedParams; // Access properties from the resolved object

    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const transformation = transformationTypes[type];
    const user = await getUserById(userId);

    return (
        <>
            <Header
                title={transformation.title}
                subtitle={transformation.subTitle}
            />
            <section className="mt-10">
                <TransformationForm
                    action="Add"
                    userId={user._id}
                    type={transformation.type as TransformationTypeKey}
                    creditBalance={user.creditBalance}
                />
            </section>
        </>
    );
};

export default AddTransformationTypePage;
