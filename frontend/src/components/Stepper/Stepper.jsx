import React from 'react'
import { motion } from "framer-motion"
import { CheckIcon } from "lucide-react"
import PropTypes from 'prop-types'

function Stepper({ steps, currentStep }) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <motion.div
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                index < currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : index === currentStep
                  ? "border-primary text-primary"
                  : "border-muted-foreground text-muted-foreground"
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: index === currentStep ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {index < currentStep ? (
                <CheckIcon className="h-6 w-6" />
              ) : (
                <span>{index + 1}</span>
              )}
            </motion.div>
            <motion.span
              className="mt-2 text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {step}
            </motion.span>
          </div>
        ))}
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-muted">
        <motion.div
          className="h-2 rounded-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}

Stepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentStep: PropTypes.number.isRequired
}

export default Stepper