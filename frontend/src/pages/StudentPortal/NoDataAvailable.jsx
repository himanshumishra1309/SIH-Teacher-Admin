import { Card, CardContent } from "@/components/ui/card"
import { InboxIcon } from 'lucide-react'

export default function NoDataAvailable() {
  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <InboxIcon className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Data Available</h2>
        <p className="text-center text-gray-500">
          There is no lecture feedback data available at the moment. Please check back later.
        </p>
      </CardContent>
    </Card>
  )
}

