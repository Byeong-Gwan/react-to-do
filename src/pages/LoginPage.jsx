import React, { useState } from "react";
import { supabase } from '../lib/supabaseClient';

function LoginPage() {
    const [email, setEmail] = useState("");

    const login = async () => {
        const { error } = await supabase.auth.signInWithOtp({
            email,
        });

        if (error) {
            alert(error.message);
        }else {
            alert("이메일로 로그인 링크를 보냈습니다.");
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        
        <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
        <h1>Login</h1>
            <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                    w-full rounded-lg border border-zinc-700 bg-zinc-900
                    px-4 py-3 text-sm text-zinc-100
                    placeholder:text-zinc-500
                    outline-none focus:border-zinc-500
                    focus:ring-2 focus:ring-zinc-500/40
                    "
            />  
    
            <div className="flex justify-center">
                <button
                    onClick={login}
                    className="
                        rounded-lg bg-white
                        px-6 py-2 text-sm font-semibold
                        text-zinc-900 hover:bg-zinc-1000
                        "
                >로그인</button>
            </div>
        </div>
  </div>
  
  )
}

export default LoginPage
