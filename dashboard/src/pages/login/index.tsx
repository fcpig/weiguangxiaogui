import { useLogin } from "@refinedev/core";
import { useState } from "react";
import { Shield } from "lucide-react";

export const Login = () => {
  const { mutate: login, isPending } = useLogin();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!phone || !password) {
      setError("请输入手机号和密码");
      return;
    }

    login(
      { phone, password },
      {
        onSuccess: () => {
          setSuccess("登录成功，正在跳转...");
        },
        onError: (err: any) => {
          setError(err?.message || "账号/密码有误");
        },
      }
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E40AF 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '32px',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.98)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '12px',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '28px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #D97706 100%)',
              boxShadow: '0 10px 30px rgba(30, 64, 175, 0.4)',
            }}
          >
            <Shield size={32} />
          </div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E40AF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            扬名街道公益柜机系统
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B' }}>
            智能管理 · 爱心传递 · 科技赋能
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {success && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                color: '#16A34A',
                border: '1px solid #86EFAC',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.818-1.16-1.161a.75.75 0 00-1.06 1.062l1.768 1.768a.75.75 0 001.102-.112l4.087-5.595z" fill="currentColor"/>
              </svg>
              {success}
            </div>
          )}

          {error && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
                color: '#DC2626',
                border: '1px solid #FECACA',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" fill="currentColor"/>
              </svg>
              {error}
            </div>
          )}

          <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value.trim())}
              placeholder="请输入手机号"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                borderRadius: '8px',
                background: '#F1F5F9',
                border: '2px solid #E2E8F0',
                color: '#1E293B',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1E40AF';
                e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E2E8F0';
                e.target.style.boxShadow = 'none';
              }}
            />

          <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              placeholder="请输入密码"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                borderRadius: '8px',
                background: '#F1F5F9',
                border: '2px solid #E2E8F0',
                color: '#1E293B',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1E40AF';
                e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E2E8F0';
                e.target.style.boxShadow = 'none';
              }}
            />

          <button
            type="submit"
            disabled={isPending}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: 600,
              color: 'white',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
              border: 'none',
              cursor: isPending ? 'not-allowed' : 'pointer',
              opacity: isPending ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(30, 64, 175, 0.4)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isPending ? (
              <>
                <svg
                  style={{ animation: 'spin 1s linear infinite' }}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    style={{ opacity: 0.25 }}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    style={{ opacity: 0.75 }}
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                登录中...
              </>
            ) : (
              '登 录'
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #E2E8F0',
            textAlign: 'center',
            fontSize: '12px',
            color: '#94A3B8',
          }}
        >
          开发者：河南大学·王子天
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
