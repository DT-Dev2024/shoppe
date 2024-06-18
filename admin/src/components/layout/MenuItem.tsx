import React from 'react';

interface MenuItemProps {
    title: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any,
    link: string
}

const MenuItem: React.FC<MenuItemProps> = ({ title, icon: Icon, link }) => {
    return (
        <div className="flex w-full h-[10vh] items-center p-3 border-b hover:bg-gray-100 hover:text-gray-800 hover:cursor-pointer"
            onClick={() => window.location.href = link}
        >
            <Icon />
            <h1 className="ml-4 font-[500] text-lg">{title}</h1>
        </div>
    );
}

export default MenuItem;
