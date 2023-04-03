import { useSignIn } from "react-auth-kit";

const useFakeSignIn = () => {
  const signIn = useSignIn();

  const fakeSignIn = () => {
    signIn({
      token: process.env.REACT_APP_NOTION_API_KEY_ID,
      expiresIn: 60,
      tokenType: "string",
      authState: {
        integration: {
          id: "16eb2615-67cb-49af-8adb-8f9036cc9144",
          type: "internal",
        },
        person: {
          id: "245df54e-41b9-46f8-a13c-142c6ee7c52f",
          name: "Oskar Åhling",
          role: "Big Boss",
          notion_id: "901e01bb-f221-48dd-a233-b368a1c004f8",
          notion_name: "Oskar",
          notion_email: "oskar.ahling@edu.edugrade.se",
          avatar_url:
            "https://s3-us-west-2.amazonaws.com/public.notion-static.com/fea34a59-d0fd-4a31-a5eb-fb4d178fa527/koala-logo.png",
        },
      },
    });
  };

  return fakeSignIn;
};

export { useFakeSignIn };
