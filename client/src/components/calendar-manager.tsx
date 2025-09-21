import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar as CalendarIcon, Edit, Trash2, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiRequest, queryClient } from "@/lib/queryClient"
import { useMutation, useQuery } from "@tanstack/react-query"

interface Calendar {
  id: string
  name: string
  description?: string
  color: string
  userId: string
  isActive: string
  createdAt: string
  updatedAt: string
}

const CALENDAR_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald  
  "#8b5cf6", // Purple
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#f97316", // Orange
  "#ec4899", // Pink
  "#6b7280"  // Gray
]

export function CalendarManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingCalendar, setEditingCalendar] = useState<Calendar | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
    startTime: "",
    endTime: ""
  })

  // Helper functions for dropdown options
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear; i <= currentYear + 2; i++) {
      years.push(i)
    }
    return years
  }

  const getMonthOptions = () => [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ]

  const getDayOptions = (year: number, month: number) => {
    const daysInMonth = new Date(year, month, 0).getDate()
    const days = []
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i.toString().padStart(2, '0'))
    }
    return days
  }

  const getHourOptions = () => {
    const hours = []
    for (let i = 0; i < 24; i++) {
      hours.push(i.toString().padStart(2, '0'))
    }
    return hours
  }

  const getMinuteOptions = () => {
    const minutes = []
    for (let i = 0; i < 60; i += 15) {
      minutes.push(i.toString().padStart(2, '0'))
    }
    return minutes
  }

  // Parse datetime string into components
  const parseDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return { year: '', month: '', day: '', hour: '', minute: '' }
    const date = new Date(dateTimeStr)
    return {
      year: date.getFullYear().toString(),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      day: date.getDate().toString().padStart(2, '0'),
      hour: date.getHours().toString().padStart(2, '0'),
      minute: date.getMinutes().toString().padStart(2, '0')
    }
  }

  // Combine date/time components into ISO string
  const combineDateTime = (year: string, month: string, day: string, hour: string, minute: string) => {
    if (!year || !month || !day || !hour || !minute) return ''
    return `${year}-${month}-${day}T${hour}:${minute}`
  }
  const { toast } = useToast()

  // Fetch user calendars
  const { data: calendars = [], isLoading } = useQuery({
    queryKey: ['/api/calendars'],
    staleTime: 30000
  })

  // Create calendar mutation
  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest('POST', '/api/calendars', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendars'] })
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] })
      setIsCreateDialogOpen(false)
      resetForm()
      toast({
        title: "Calendar created",
        description: "Your new calendar has been created successfully."
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create calendar",
        variant: "destructive"
      })
    }
  })

  // Update calendar mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: typeof formData }) => 
      apiRequest('PUT', `/api/calendars/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendars'] })
      setEditingCalendar(null)
      resetForm()
      toast({
        title: "Calendar updated",
        description: "Calendar has been updated successfully."
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update calendar",
        variant: "destructive"
      })
    }
  })

  // Delete calendar mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/calendars/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendars'] })
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] })
      toast({
        title: "Calendar deleted",
        description: "Calendar has been deleted successfully."
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error", 
        description: error.message || "Failed to delete calendar",
        variant: "destructive"
      })
    }
  })

  const resetForm = () => {
    const now = new Date()
    const oneHour = new Date(now.getTime() + 60 * 60 * 1000)
    
    setFormData({
      name: "",
      description: "",
      color: "#3b82f6",
      startTime: now.toISOString().slice(0, 16),
      endTime: oneHour.toISOString().slice(0, 16)
    })
  }

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Calendar name is required",
        variant: "destructive"
      })
      return
    }
    createMutation.mutate(formData)
  }

  const handleUpdate = () => {
    if (!editingCalendar || !formData.name.trim()) return
    updateMutation.mutate({ id: editingCalendar.id, data: formData })
  }

  const handleEdit = (calendar: Calendar) => {
    setEditingCalendar(calendar)
    setFormData({
      name: calendar.name,
      description: calendar.description || "",
      color: calendar.color
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this calendar? All events will be lost.")) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <Card data-testid="card-calendar-manager">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            My Calendars
          </span>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" data-testid="button-create-calendar">
                <Plus className="h-4 w-4 mr-2" />
                New Calendar
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-create-calendar">
              <DialogHeader>
                <DialogTitle>Create New Calendar</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="calendar-name">Calendar Name</Label>
                  <Input
                    id="calendar-name"
                    data-testid="input-calendar-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Calendar"
                  />
                </div>
                
                <div>
                  <Label htmlFor="calendar-description">Description (Optional)</Label>
                  <Textarea
                    id="calendar-description"
                    data-testid="input-calendar-description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Personal events, work meetings, etc."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Color</Label>
                  <div className="flex flex-wrap gap-2 mt-2" data-testid="color-picker">
                    {CALENDAR_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color ? 'border-gray-400' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        data-testid={`color-option-${color}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Start Date & Time */}
                  <div>
                    <Label>Start Date & Time</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {/* Start Date Dropdowns */}
                      <Select
                        value={parseDateTime(formData.startTime).year}
                        onValueChange={(value) => {
                          const parsed = parseDateTime(formData.startTime)
                          const newDateTime = combineDateTime(value, parsed.month || '01', parsed.day || '01', parsed.hour || '09', parsed.minute || '00')
                          setFormData(prev => ({ ...prev, startTime: newDateTime }))
                        }}
                      >
                        <SelectTrigger data-testid="select-calendar-start-year">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {getYearOptions().map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={parseDateTime(formData.startTime).month}
                        onValueChange={(value) => {
                          const parsed = parseDateTime(formData.startTime)
                          const newDateTime = combineDateTime(parsed.year || new Date().getFullYear().toString(), value, parsed.day || '01', parsed.hour || '09', parsed.minute || '00')
                          setFormData(prev => ({ ...prev, startTime: newDateTime }))
                        }}
                      >
                        <SelectTrigger data-testid="select-calendar-start-month">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {getMonthOptions().map(month => (
                            <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={parseDateTime(formData.startTime).day}
                        onValueChange={(value) => {
                          const parsed = parseDateTime(formData.startTime)
                          const year = parseInt(parsed.year || new Date().getFullYear().toString())
                          const month = parseInt(parsed.month || '01')
                          const newDateTime = combineDateTime(year.toString(), parsed.month || '01', value, parsed.hour || '09', parsed.minute || '00')
                          setFormData(prev => ({ ...prev, startTime: newDateTime }))
                        }}
                      >
                        <SelectTrigger data-testid="select-calendar-start-day">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {getDayOptions(
                            parseInt(parseDateTime(formData.startTime).year || new Date().getFullYear().toString()),
                            parseInt(parseDateTime(formData.startTime).month || '01')
                          ).map(day => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {/* Start Time Dropdowns */}
                      <Select
                        value={parseDateTime(formData.startTime).hour}
                        onValueChange={(value) => {
                          const parsed = parseDateTime(formData.startTime)
                          const newDateTime = combineDateTime(parsed.year || new Date().getFullYear().toString(), parsed.month || '01', parsed.day || '01', value, parsed.minute || '00')
                          setFormData(prev => ({ ...prev, startTime: newDateTime }))
                        }}
                      >
                        <SelectTrigger data-testid="select-calendar-start-hour">
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {getHourOptions().map(hour => (
                            <SelectItem key={hour} value={hour}>{hour}:00</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={parseDateTime(formData.startTime).minute}
                        onValueChange={(value) => {
                          const parsed = parseDateTime(formData.startTime)
                          const newDateTime = combineDateTime(parsed.year || new Date().getFullYear().toString(), parsed.month || '01', parsed.day || '01', parsed.hour || '09', value)
                          setFormData(prev => ({ ...prev, startTime: newDateTime }))
                        }}
                      >
                        <SelectTrigger data-testid="select-calendar-start-minute">
                          <SelectValue placeholder="Minutes" />
                        </SelectTrigger>
                        <SelectContent>
                          {getMinuteOptions().map(minute => (
                            <SelectItem key={minute} value={minute}>:{minute}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* End Date & Time */}
                  <div>
                    <Label>End Date & Time</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {/* End Date Dropdowns */}
                      <Select
                        value={parseDateTime(formData.endTime).year}
                        onValueChange={(value) => {
                          const parsed = parseDateTime(formData.endTime)
                          const newDateTime = combineDateTime(value, parsed.month || '01', parsed.day || '01', parsed.hour || '10', parsed.minute || '00')
                          setFormData(prev => ({ ...prev, endTime: newDateTime }))
                        }}
                      >
                        <SelectTrigger data-testid="select-calendar-end-year">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {getYearOptions().map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={parseDateTime(formData.endTime).month}
                        onValueChange={(value) => {
                          const parsed = parseDateTime(formData.endTime)
                          const newDateTime = combineDateTime(parsed.year || new Date().getFullYear().toString(), value, parsed.day || '01', parsed.hour || '10', parsed.minute || '00')
                          setFormData(prev => ({ ...prev, endTime: newDateTime }))
                        }}
                      >
                        <SelectTrigger data-testid="select-calendar-end-month">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {getMonthOptions().map(month => (
                            <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={parseDateTime(formData.endTime).day}
                        onValueChange={(value) => {
                          const parsed = parseDateTime(formData.endTime)
                          const year = parseInt(parsed.year || new Date().getFullYear().toString())
                          const month = parseInt(parsed.month || '01')
                          const newDateTime = combineDateTime(year.toString(), parsed.month || '01', value, parsed.hour || '10', parsed.minute || '00')
                          setFormData(prev => ({ ...prev, endTime: newDateTime }))
                        }}
                      >
                        <SelectTrigger data-testid="select-calendar-end-day">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {getDayOptions(
                            parseInt(parseDateTime(formData.endTime).year || new Date().getFullYear().toString()),
                            parseInt(parseDateTime(formData.endTime).month || '01')
                          ).map(day => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {/* End Time Dropdowns */}
                      <Select
                        value={parseDateTime(formData.endTime).hour}
                        onValueChange={(value) => {
                          const parsed = parseDateTime(formData.endTime)
                          const newDateTime = combineDateTime(parsed.year || new Date().getFullYear().toString(), parsed.month || '01', parsed.day || '01', value, parsed.minute || '00')
                          setFormData(prev => ({ ...prev, endTime: newDateTime }))
                        }}
                      >
                        <SelectTrigger data-testid="select-calendar-end-hour">
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {getHourOptions().map(hour => (
                            <SelectItem key={hour} value={hour}>{hour}:00</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={parseDateTime(formData.endTime).minute}
                        onValueChange={(value) => {
                          const parsed = parseDateTime(formData.endTime)
                          const newDateTime = combineDateTime(parsed.year || new Date().getFullYear().toString(), parsed.month || '01', parsed.day || '01', parsed.hour || '10', value)
                          setFormData(prev => ({ ...prev, endTime: newDateTime }))
                        }}
                      >
                        <SelectTrigger data-testid="select-calendar-end-minute">
                          <SelectValue placeholder="Minutes" />
                        </SelectTrigger>
                        <SelectContent>
                          {getMinuteOptions().map(minute => (
                            <SelectItem key={minute} value={minute}>:{minute}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      resetForm()
                    }}
                    data-testid="button-cancel-create"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreate}
                    disabled={createMutation.isPending}
                    data-testid="button-confirm-create"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Calendar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center text-muted-foreground py-4" data-testid="loading-calendars">
            Loading calendars...
          </div>
        ) : calendars.length === 0 ? (
          <div className="text-center text-muted-foreground py-8" data-testid="empty-calendars">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No calendars yet. Create your first calendar to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {calendars.map((calendar: Calendar) => (
              <div
                key={calendar.id}
                className="flex items-center justify-between p-3 border rounded-lg hover-elevate"
                data-testid={`calendar-item-${calendar.id}`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: calendar.color }}
                    data-testid={`calendar-color-${calendar.id}`}
                  />
                  <div>
                    <h4 className="font-medium" data-testid={`calendar-name-${calendar.id}`}>
                      {calendar.name}
                    </h4>
                    {calendar.description && (
                      <p className="text-sm text-muted-foreground" data-testid={`calendar-description-${calendar.id}`}>
                        {calendar.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Dialog 
                    open={editingCalendar?.id === calendar.id} 
                    onOpenChange={(open) => {
                      if (!open) {
                        setEditingCalendar(null)
                        resetForm()
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(calendar)}
                        data-testid={`button-edit-${calendar.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent data-testid="dialog-edit-calendar">
                      <DialogHeader>
                        <DialogTitle>Edit Calendar</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="edit-calendar-name">Calendar Name</Label>
                          <Input
                            id="edit-calendar-name"
                            data-testid="input-edit-calendar-name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="edit-calendar-description">Description</Label>
                          <Textarea
                            id="edit-calendar-description"
                            data-testid="input-edit-calendar-description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label>Color</Label>
                          <div className="flex flex-wrap gap-2 mt-2" data-testid="edit-color-picker">
                            {CALENDAR_COLORS.map(color => (
                              <button
                                key={color}
                                type="button"
                                className={`w-8 h-8 rounded-full border-2 ${
                                  formData.color === color ? 'border-gray-400' : 'border-gray-200'
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => setFormData(prev => ({ ...prev, color }))}
                                data-testid={`edit-color-option-${color}`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setEditingCalendar(null)
                              resetForm()
                            }}
                            data-testid="button-cancel-edit"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleUpdate}
                            disabled={updateMutation.isPending}
                            data-testid="button-confirm-edit"
                          >
                            {updateMutation.isPending ? "Updating..." : "Update Calendar"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(calendar.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${calendar.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}