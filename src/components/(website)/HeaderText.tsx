import { motion } from 'framer-motion';

const HeaderText = ({title}: {title: string}) => {
    return (
        <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-center"
            style={{
                backgroundImage: "url('/assets/website/txt.jpg')",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            {title}
        </motion.h2>
    )
};

export default HeaderText;