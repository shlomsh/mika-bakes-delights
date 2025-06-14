
import React from 'react';
import RecipeCreateForm from '@/components/RecipeCreateForm';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

const NewRecipePage: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('categoryId');

    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
                <ChefHat className="h-16 w-16 text-choco animate-pulse mb-4" />
                <p className="text-choco text-xl font-fredoka">טוען...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
            <main className="w-full max-w-5xl">
                <RecipeCreateForm categoryId={categoryId} />
            </main>
        </div>
    );
};

export default NewRecipePage;
