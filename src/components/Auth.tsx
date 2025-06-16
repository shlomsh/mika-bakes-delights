
import { supabase } from '@/integrations/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User } from 'lucide-react';

const AuthComponent = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();


    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (_event === 'SIGNED_IN') {
                setIsOpen(false);
                 toast({ title: "התחברת בהצלחה!", description: `ברוך הבא, ${session?.user.email}` });
            }
             if (_event === 'SIGNED_OUT') {
                toast({ title: "התנתקת בהצלחה" });
            }
        });

        return () => subscription.unsubscribe();
    }, [toast]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (session) {
        return (
            <div className="flex items-center gap-2">
                <Button onClick={handleLogout} variant="ghost" size="icon" className="sm:w-auto sm:px-4">
                    <LogOut />
                    <span className="hidden sm:inline">התנתק</span>
                </Button>
            </div>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-choco/60 hover:text-choco hover:bg-choco/5 text-xs font-normal"
                >
                    <User className="h-3 w-3 ml-1" />
                    התחבר
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" style={{ direction: 'ltr' }}>
                <DialogHeader>
                    <DialogTitle className="text-right font-fredoka text-choco">התחברות או הרשמה</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                    <Auth
                        supabaseClient={supabase}
                        appearance={{ theme: ThemeSupa }}
                        providers={['google']}
                        theme="light"
                        localization={{
                            variables: {
                                sign_in: { email_label: 'כתובת אימייל', password_label: 'סיסמה', button_label: 'התחבר', social_provider_text: 'התחבר עם {{provider}}', link_text: 'כבר יש לך חשבון? התחבר', },
                                sign_up: { email_label: 'כתובת אימייל', password_label: 'סיסמה', button_label: 'הירשם', social_provider_text: 'הירשם עם {{provider}}', link_text: 'אין לך חשבון? הירשם', },
                                forgotten_password: { email_label: 'כתובת אימייל', button_label: 'שלח הוראות לאיפוס סיסמה', link_text: 'שכחת סיسמה?', },
                                update_password: { password_label: 'סיסמה חדשה', button_label: 'עדכן סיסמה'}
                            },
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuthComponent;
