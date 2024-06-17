import R from "@/assets";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
    return (
        <div className="flex justify-between items-center p-4 h-[10vh] bg-white border-b">
            <img src={R.images.logo} alt="logo" className="h-[8vh]" />

            <Avatar className="h-[7vh] w-[7vh]">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

        </div>);
}

export default Header;