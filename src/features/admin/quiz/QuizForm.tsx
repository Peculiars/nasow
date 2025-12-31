"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Label } from "@/src/components/ui/label"
import { StudentLevel, StudentType } from "@/src/lib/types/students"

interface QuizFormProps {
  onSubmit: (data: any) => void
  isLoading?: boolean
}

export function QuizForm({ onSubmit, isLoading }: QuizFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 30,
    totalQuestions: 10,
    passingScore: 50,
    isGeneral: false,
    selectedLevels: [] as string[],
    selectedTypes: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const target = {
      isGeneral: formData.isGeneral,
      levels: formData.isGeneral ? Object.values(StudentLevel) : formData.selectedLevels,
      types: formData.isGeneral ? Object.values(StudentType) : formData.selectedTypes,
    }

    onSubmit({
      ...formData,
      target,
      selectedLevels: undefined,
      selectedTypes: undefined,
      isGeneral: undefined,
    })
  }

  const toggleLevel = (level: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedLevels: prev.selectedLevels.includes(level)
        ? prev.selectedLevels.filter((l) => l !== level)
        : [...prev.selectedLevels, level],
    }))
  }

  const toggleType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTypes: prev.selectedTypes.includes(type)
        ? prev.selectedTypes.filter((t) => t !== type)
        : [...prev.selectedTypes, type],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
          <CardDescription>Basic information about your quiz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              placeholder="e.g. Introduction Social Problems"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this quiz is about"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="questions">Total Questions</Label>
              <Input
                id="questions"
                type="number"
                min="1"
                value={formData.totalQuestions}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    totalQuestions: Number.parseInt(e.target.value),
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passing">Passing Score (%)</Label>
              <Input
                id="passing"
                type="number"
                min="0"
                max="100"
                value={formData.passingScore}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    passingScore: Number.parseInt(e.target.value),
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Target Audience</CardTitle>
          <CardDescription>Who should take this quiz?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="general"
              checked={formData.isGeneral}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  isGeneral: checked as boolean,
                  selectedLevels: [],
                  selectedTypes: [],
                }))
              }
            />
            <Label htmlFor="general" className="font-normal cursor-pointer">
              General (All students)
            </Label>
          </div>

          {!formData.isGeneral && (
            <>
              <div className="space-y-3">
                <Label>Student Levels</Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(StudentLevel).map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`level-${level}`}
                        checked={formData.selectedLevels.includes(level)}
                        onCheckedChange={() => toggleLevel(level)}
                      />
                      <Label htmlFor={`level-${level}`} className="font-normal cursor-pointer">
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Student Types</Label>
                <div className="space-y-2">
                  {Object.values(StudentType).map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={formData.selectedTypes.includes(type)}
                        onCheckedChange={() => toggleType(type)}
                      />
                      <Label htmlFor={`type-${type}`} className="font-normal cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading} className="w-full h-14 bg-green-600 hover:bg-green-700 text-white">
        {isLoading ? "Creating..." : "Create Quiz"}
      </Button>
    </form>
  )
}
