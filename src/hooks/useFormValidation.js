import { useState, useMemo } from 'react'

export const useFormValidation = (inputs) => {
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [isValidPassword, setIsValidPassword] = useState(false)

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsValidEmail(regex.test(email))
  }

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d](?=.*[~!@#$%^&*()]).{8,}$/
    setIsValidPassword(regex.test(password))
  }

  const isFormValid = useMemo(() => {
    if (inputs.includes('password')) return isValidPassword
    return isValidEmail
  }, [inputs, isValidEmail, isValidPassword])

  return {
    isValidEmail,
    isValidPassword,
    validateEmail,
    validatePassword,
    isFormValid,
  }
}
