const Footer = () => {
    return (
        <div className='flex flex-col justify-center items-center text-white bg-black py-4'>
            <p>{`© ${new Date().getFullYear()} StarryCiels. All Rights Reserved.`}</p>
            <p>{`Created by MeteorVIIx`}</p>
        </div>
    )
};

export default Footer;