import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export function notFoundHandler(_request: Request, response: Response) {
  response.status(404).json({
    success: false,
    message: 'Route not found.',
  })
}

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    response.status(400).json({
      success: false,
      message: 'Validation failed.',
      issues: error.flatten(),
    })
    return
  }

  const message = error instanceof Error ? error.message : 'Internal server error.'
  console.error(error)

  response.status(500).json({
    success: false,
    message,
  })
}
