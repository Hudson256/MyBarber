import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { FaGoogle, FaDiscord, FaFacebook } from "react-icons/fa";
const providers = [
    { name: "google", label: "Google", icon: FaGoogle },
    { name: "discord", label: "Discord", icon: FaDiscord },
    { name: "facebook", label: "Facebook", icon: FaFacebook },
];
const SignInDialog = () => {
    const handleLogin = (provider) => () => signIn(provider);
    return (<>
      <DialogHeader>
        <DialogTitle>Faça login na plataforma</DialogTitle>
        <DialogDescription>
          Conecte-se usando uma das opções abaixo.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col space-y-2">
        {providers.map((provider) => (<Button key={provider.name} variant="outline" className="gap-2 font-bold" onClick={handleLogin(provider.name)}>
            <provider.icon className="h-5 w-5"/>
            {provider.label}
          </Button>))}
      </div>
    </>);
};
export default SignInDialog;
