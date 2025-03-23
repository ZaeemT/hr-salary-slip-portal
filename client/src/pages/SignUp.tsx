import { Register } from "@/services/auth.service"
import { SignUpForm } from "@/components/SignUpForm"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

export default function SignUp() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSignUp = async (username: string, email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await Register(username, email, password)
      
      if (response.status === 'success') {
        toast({
          title: "Success",
          description: "Account created successfully",
          variant: "default",
        })
        navigate('/home')
      } else {
        setError(response.message || 'Registration failed')
      }
    } catch (err: any) {
      console.log(err)
      toast({
        title: "Registration failed",
        description: err.response?.data?.message || 'Something went wrong',
        variant: "destructive",
      })
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm z-10">
        <SignUpForm 
          onSubmit={handleSignUp}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}
