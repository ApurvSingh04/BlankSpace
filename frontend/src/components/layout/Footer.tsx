export const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto py-8">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} BlankSpace. All rights reserved.</p>
                <div className="flex justify-center gap-4 mt-4">
                    <span className="hover:text-gray-900 cursor-pointer">About</span>
                    <span className="hover:text-gray-900 cursor-pointer">Terms</span>
                    <span className="hover:text-gray-900 cursor-pointer">Privacy</span>
                </div>
            </div>
        </footer>
    );
};
