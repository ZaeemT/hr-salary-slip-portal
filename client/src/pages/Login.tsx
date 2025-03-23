import { Login as LoginService } from "@/services/auth.service"
import { LoginForm } from "@/components/LoginForm"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await LoginService(email, password)
      
      if (response.status === 'success') {
        toast({
          title: "Success",
          description: "Logged in successfully",
          variant: "default",
        })
        navigate('/home')
      } else {
        setError(response.message || 'Login failed')
      }
    } catch (err: any) {
      console.log(err)
      toast({
        title: "Login failed",
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
      <div className="w-full max-w-sm">
        <LoginForm 
          onSubmit={handleLogin}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}
