import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiRequest, queryClient } from "@/lib/queryClient"
import { useMutation, useQuery } from "@tanstack/react-query"

interface Calendar {
  id: string
  name: string
  color: string
}

export function EventCreator() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    calendarId: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    isAllDay: false
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

  // Fetch user calendars for selection
  const { data: calendars = [] } = useQuery({
    queryKey: ['/api/calendars'],
    staleTime: 30000
  })

  // Create event mutation
  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest('POST', '/api/events', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] })
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] })
      setIsDialogOpen(false)
      resetForm()
      toast({
        title: "Event created",
        description: "Your event has been created and categorized automatically."
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive"
      })
    }
  })

  const resetForm = () => {
    const now = new Date()
    const oneHour = new Date(now.getTime() + 60 * 60 * 1000)
    
    setFormData({
      calendarId: calendars[0]?.id || "",
      title: "",
      description: "",
      startTime: now.toISOString().slice(0, 16),
      endTime: oneHour.toISOString().slice(0, 16),
      location: "",
      isAllDay: false
    })
  }

  const handleCreate = () => {
    if (!formData.calendarId) {
      toast({
        title: "Error",
        description: "Please select a calendar",
        variant: "destructive"
      })
      return
    }

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Event title is required",
        variant: "destructive"
      })
      return
    }

    if (!formData.startTime || !formData.endTime) {
      toast({
        title: "Error",
        description: "Start and end times are required",
        variant: "destructive"
      })
      return
    }

    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      toast({
        title: "Error",
        description: "End time must be after start time",
        variant: "destructive"
      })
      return
    }

    createMutation.mutate(formData)
  }

  const handleDialogOpen = (open: boolean) => {
    setIsDialogOpen(open)
    if (open) {
      resetForm()
    }
  }

  if (calendars.length === 0) {
    return (
      <Card data-testid="card-no-calendars">
        <CardContent className="p-6 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">
            Create a calendar first to start adding events
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-create-event">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" data-testid="dialog-create-event">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="event-calendar">Calendar</Label>
            <Select
              value={formData.calendarId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, calendarId: value }))}
            >
              <SelectTrigger data-testid="select-calendar">
                <SelectValue placeholder="Select a calendar" />
              </SelectTrigger>
              <SelectContent>
                {calendars.map((calendar: Calendar) => (
                  <SelectItem key={calendar.id} value={calendar.id} data-testid={`calendar-option-${calendar.id}`}>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: calendar.color }}
                      />
                      <span>{calendar.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="event-title">Event Title</Label>
            <Input
              id="event-title"
              data-testid="input-event-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Team meeting, Gym workout, etc."
            />
          </div>

          <div>
            <Label htmlFor="event-description">Description (Optional)</Label>
            <Textarea
              id="event-description"
              data-testid="input-event-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Event details..."
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="all-day"
              checked={formData.isAllDay}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAllDay: checked }))}
              data-testid="switch-all-day"
            />
            <Label htmlFor="all-day">All day event</Label>
          </div>

          {!formData.isAllDay && (
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
                    <SelectTrigger data-testid="select-start-year">
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
                    <SelectTrigger data-testid="select-start-month">
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
                    <SelectTrigger data-testid="select-start-day">
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
                    <SelectTrigger data-testid="select-start-hour">
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
                    <SelectTrigger data-testid="select-start-minute">
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
                    <SelectTrigger data-testid="select-end-year">
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
                    <SelectTrigger data-testid="select-end-month">
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
                    <SelectTrigger data-testid="select-end-day">
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
                    <SelectTrigger data-testid="select-end-hour">
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
                    <SelectTrigger data-testid="select-end-minute">
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
          )}

          <div>
            <Label htmlFor="event-location">Location (Optional)</Label>
            <Input
              id="event-location"
              data-testid="input-event-location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Conference room, gym, etc."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              data-testid="button-cancel-event"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={createMutation.isPending}
              data-testid="button-confirm-event"
            >
              {createMutation.isPending ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}