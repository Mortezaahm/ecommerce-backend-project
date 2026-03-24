import 'express'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        name: string
        email: string
        role?: 'user' | 'admin'
      }
    }

    interface Response {
      sendSuccess: (data: any) => void
      sendError: (message: string, statusCode?: number) => void
    }
  }
}

export {}
