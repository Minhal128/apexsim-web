"use client";
import React, { useState } from "react";
import Link from "next/link";
import { EyeOff, Eye } from "lucide-react";
import { IoLogoApple } from "react-icons/io5";
import { FaCaretDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";


const countries = [
  { code: "us", label: "United States" },
  { code: "uk", label: "United Kingdom" },
  { code: "ca", label: "Canada" },
];

const countryCodes = [
  { code: "+1", label: "USA" },
  { code: "+44", label: "UK" },
  { code: "+61", label: "Australia" },
  { code: "+92", label: "Pakistan" },
  { code: "+91", label: "India" },
];

export default function SignupView() {
  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [codeDropdownOpen, setCodeDropdownOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("+1");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone ? `${countryCode}${formData.phone}` : undefined
        }),
      });
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/auth/verify-signup", {
        method: "POST",
        body: JSON.stringify({ email: formData.email, otp: otp.join("") }),
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard/wallet");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextElementSibling && element.value !== "") {
      (element.nextElementSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && (e.currentTarget.previousElementSibling)) {
      (e.currentTarget.previousElementSibling as HTMLInputElement).focus();
    }
  };

  return (
    <section className="md:min-h-screen bg-[#181818] px-4 md:px-8 py-6 md:py-12 flex items-center justify-center font-inter">
      <div className="max-w-325 font-manrope w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="bg-[#1f1f1f] rounded-2xl px-4 md:px-10 pt-10 pb-12 flex flex-col justify-start">

          {step === 'signup' ? (
            <>
              <h2 className="text-3xl md:text-3xl font-semibold text-white mb-8 mt-2 font-bricolage">
                Create an Account
              </h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#252525] border border-transparent rounded-full px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 transition-all font-inter"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#252525] border border-transparent rounded-full px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 transition-all font-inter"
                  />
                  <div className="relative">
                    <div
                      onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                      className="w-full bg-[#252525] rounded-full px-4 py-4 flex items-center justify-between border border-transparent hover:border-white/10 group relative cursor-pointer"
                    >
                      <span className="text-white text-md">
                        {selectedCountry ? countries.find((c) => c.code === selectedCountry)?.label : "Country of Residence"}
                      </span>
                      <FaCaretDown size={18} className="text-gray-500 group-hover:text-white transition-colors pointer-events-none" />
                    </div>
                    {countryDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-full bg-[#1f1f1f] rounded-xl border border-white/10 overflow-hidden z-50">
                        {countries.map((country) => (
                          <div
                            key={country.code}
                            onClick={() => {
                              setSelectedCountry(country.code);
                              setCountryDropdownOpen(false);
                            }}
                            className={`px-4 py-2 text-md cursor-pointer hover:bg-white/10 ${selectedCountry === country.code ? "text-white bg-white/10" : "text-gray-400"}`}
                          >
                            {country.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 relative">
                    <div
                      onClick={() => setCodeDropdownOpen(!codeDropdownOpen)}
                      className="w-25 bg-[#252525] rounded-full px-4 py-4 flex items-center justify-between border border-transparent hover:border-white/10 group relative cursor-pointer"
                    >
                      <span className="text-white text-md">{countryCode}</span>
                      <FaCaretDown size={14} className="text-gray-500 group-hover:text-white transition-colors pointer-events-none" />
                      {codeDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-[#1f1f1f] rounded-xl border border-white/10 overflow-hidden z-50">
                          {countryCodes.map((c) => (
                            <div
                              key={c.code}
                              onClick={() => {
                                setCountryCode(c.code);
                                setCodeDropdownOpen(false);
                              }}
                              className={`px-4 py-2 text-md cursor-pointer hover:bg-white/10 ${countryCode === c.code ? "text-white bg-white/10" : "text-gray-400"}`}
                            >
                              {c.label} ({c.code})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="flex-1 bg-[#252525] border border-transparent rounded-full px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 transition-all font-inter"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-[#252525] border border-transparent rounded-full px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 transition-all font-inter"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Eye className="text-white w-5 h-5 hover:text-gray-400 transition-colors" /> : <EyeOff className="text-white w-5 h-5 hover:text-gray-400 transition-colors" />}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0055FF] text-white py-4 rounded-full font-semibold text-md shadow-[0_8px_30px_rgb(0,85,255,0.3)] cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Signing up..." : "Sign up"}
                </button>
                <div className="pt-3">
                  <div className="flex items-center justify-center mb-4 gap-4">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-md text-gray-500 tracking-wide font-manrope whitespace-nowrap">Or sign up with</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                  <div className="flex justify-center gap-4">
                    <button type="button" className="w-14 h-14 rounded-full bg-[#1E1E1E] border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                      <img src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" alt="Google" className="w-6 h-6" />
                    </button>
                    <button type="button" className="w-14 h-14 rounded-full bg-[#1E1E1E] border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                      <IoLogoApple className="text-white w-7 h-7" />
                    </button>
                    <button type="button" className="w-14 h-14 rounded-full bg-[#1E1E1E] border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                      <img src="https://www.svgrepo.com/show/303114/facebook-3-logo.svg" alt="Facebook" className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <p className="text-center text-gray-500 text-md pt-4 font-inter">
                  Already have an account? <button type="button" onClick={() => router.push("/login")} className="text-white font-semibold hover:underline">Login</button>
                </p>
              </form>
            </>
          ) : (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-3xl font-semibold text-white mb-4 mt-2 font-bricolage">Verify Email</h2>
              <p className="text-gray-400 mb-8 font-inter">We've sent a 6-digit verification code to your email. Please enter it below.</p>

              <form onSubmit={handleVerifyOtp} className="space-y-8">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-between gap-2 mb-8">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={data}
                      onChange={e => handleOtpChange(e.target, index)}
                      onKeyDown={e => handleKeyDown(e, index)}
                      onFocus={e => e.target.select()}
                      className="w-full h-14 bg-[#252525] border border-transparent rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:border-white/20 transition-all"
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0055FF] text-white py-4 rounded-full font-semibold text-md shadow-[0_8px_30px_rgb(0,85,255,0.3)] cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </button>
                <p className="text-center text-gray-500 text-md font-inter">
                  Didn't receive the code? <button type="button" onClick={async () => { setLoading(true); setError(""); try { await apiRequest("/auth/resend-otp", { method: "POST", body: JSON.stringify({ email: formData.email }) }); alert("OTP resent!"); } catch (err: any) { setError(err.message); } finally { setLoading(false); } }} className="text-white font-semibold hover:underline">Resend</button>
                </p>
              </form>
            </div>
          )}
        </div>

        <div className="hidden lg:flex border border-gray-300/10 rounded-2xl flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute z-30 top-30 text-center ">
            <h2 className="text-[40px] font-bold text-white  font-manrope">
              Enjoy up to $100 <span className="text-[#508BFF]"> USDT</span>
            </h2>
            <p className="text-gray-400 max-w-lg py-5 mx-auto text-lg leading-relaxed font-inter">
              Get up to $5,030 by signing up, depositing, and trading!
            </p>
          </div>

          <div className="relative top-20 z-10 w-full max-w-137.5 h-125 flex items-center justify-center">
            <img
              src="/images/signuppic.png"
              alt="Branding Illustration"
              className="w-full h-full object-contain "
            />
          </div>
        </div>
      </div>
    </section>
  );
}

