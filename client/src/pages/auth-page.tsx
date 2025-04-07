import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palmtree, LockIcon, UserIcon } from "lucide-react";
import SEO from "@/components/SEO";

// Extend the insert schema to add validation
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");

  // If user is already logged in, redirect to home page
  if (user) {
    return <Redirect to="/" />;
  }

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Submit handlers
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: RegisterFormValues) => {
    const { confirmPassword, ...userData } = values;
    registerMutation.mutate(userData);
  };

  return (
    <>
      <SEO 
        title="Login or Register | Cabo Travel Guide" 
        description="Sign in to your Cabo Travel Guide account to manage bookings, earn rewards, and get personalized recommendations."
      />
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Auth Forms Column */}
        <div className="w-full lg:w-1/2 p-6 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-2">
                <Palmtree className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">Welcome to Cabo Travel Guide</CardTitle>
              <CardDescription className="text-center">
                Sign in to manage your bookings and earn rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-10" placeholder="Enter your username" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <LockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-10" type="password" placeholder="Enter your password" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-10" placeholder="Choose a username" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <LockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-10" type="password" placeholder="Choose a password" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <LockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-10" type="password" placeholder="Confirm your password" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-sm text-center text-muted-foreground">
                {activeTab === "login" ? (
                  <p>Don't have an account? <Button variant="link" className="p-0" onClick={() => setActiveTab("register")}>Sign up</Button></p>
                ) : (
                  <p>Already have an account? <Button variant="link" className="p-0" onClick={() => setActiveTab("login")}>Log in</Button></p>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Hero Image Column */}
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-sky-500 to-indigo-500 p-12 text-white">
          <div className="h-full flex flex-col justify-center items-start max-w-xl">
            <h1 className="text-4xl font-bold mb-6">Your Ultimate Cabo Adventure Awaits</h1>
            <ul className="space-y-4 text-lg mb-8">
              <li className="flex items-center">✓ Manage all your bookings in one place</li>
              <li className="flex items-center">✓ Earn rewards for your activities</li>
              <li className="flex items-center">✓ Get personalized travel recommendations</li>
              <li className="flex items-center">✓ Access exclusive deals and offers</li>
            </ul>
            <p className="text-lg">
              Join thousands of travelers who've discovered the best of Cabo San Lucas
              through our platform.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}