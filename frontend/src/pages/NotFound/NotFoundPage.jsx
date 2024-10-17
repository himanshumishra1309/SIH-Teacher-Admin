import React from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div>
    <div>404 Not Found</div>
    <Link to="/">
<Button >Back to Home Page</Button>      

    </Link>
    </div>

  )
}

export default NotFoundPage