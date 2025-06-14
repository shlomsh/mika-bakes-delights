
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import { History, UserCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Log {
  id: string;
  created_at: string;
  changes: {
    name: string;
    description: string;
    ingredients: { description: string }[];
    instructions: { description: string }[];
  };
}

const fetchLogs = async (recipeId: string): Promise<Log[]> => {
    const { data, error } = await supabase
        .from('recipe_update_logs')
        .select('id, created_at, changes')
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching recipe logs:', error);
        return [];
    }
    return data as Log[];
};

const RecipeUpdateLogs: React.FC<{ recipeId: string }> = ({ recipeId }) => {
    const { data: logs, isLoading } = useQuery({
        queryKey: ['recipeLogs', recipeId],
        queryFn: () => fetchLogs(recipeId)
    });

    if (isLoading) {
        return (
            <div className="mt-8 w-full max-w-5xl">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        );
    }

    if (!logs || logs.length === 0) {
        return null;
    }

    return (
        <Card className="mt-8 w-full max-w-5xl shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center font-fredoka text-xl text-choco">
                    <History className="ml-2 h-5 w-5 text-pastelOrange" />
                    היסטוריית עדכונים
                </CardTitle>
                <CardDescription>
                    השינויים האחרונים שבוצעו במתכון.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {logs.map(log => (
                        <li key={log.id} className="p-4 rounded-md bg-white border border-choco/10">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-fredoka text-md text-choco flex items-center">
                                    <UserCircle className="ml-2 h-5 w-5 text-pastelBlue" />
                                    בוצע עדכון
                                </p>
                                <p className="text-sm text-choco/70">
                                    {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: he })}
                                </p>
                            </div>
                            <div className="text-sm text-choco/90 space-y-1 p-3 bg-pastelYellow/20 rounded-md">
                               <p><strong>שם:</strong> {log.changes.name}</p>
                               <p><strong>תיאור:</strong> {log.changes.description ? `${log.changes.description.substring(0, 50)}...` : 'אין'}</p>
                               <p><strong>מספר מצרכים:</strong> {log.changes.ingredients.length}</p>
                               <p><strong>מספר שלבי הכנה:</strong> {log.changes.instructions.length}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default RecipeUpdateLogs;
