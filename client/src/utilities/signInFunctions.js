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
          id: "xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx",
          type: "internal",
        },
        person: {
          id: "xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx",
          name: "John Doe",
          role: "Big Boss",
          notion_id: "xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx",
          notion_name: "John",
          notion_email: "john.doe@mail.com",
          avatar_url:
            null,
        },
      },
    });
  };

  return fakeSignIn;
};

export { useFakeSignIn };
