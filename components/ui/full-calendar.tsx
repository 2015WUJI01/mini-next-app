'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInDays,
  differenceInMinutes,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  getHours,
  getMinutes,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
  set,
  setHours,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: 'red' | 'pink' | 'green' | 'blue' | 'yellow' | 'purple' | 'indigo';
};

export type CalendarView = 'day' | 'week' | 'month' | 'year';

interface CalendarContextProps {
  date: Date;
  view: CalendarView;
  events: CalendarEvent[];
  locale?: Locale;
  visibleViews: CalendarView[];
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  setView: React.Dispatch<React.SetStateAction<CalendarView>>;
  next: () => void;
  prev: () => void;
  today: () => void;
}

const CalendarContext = createContext<CalendarContextProps | null>(null);

export function Calendar({
  events = [],
  children,
  defaultDate = new Date(),
  defaultView = 'month',
  locale = zhCN,
  visibleViews = ['day', 'week', 'month', 'year'],
}: {
  events?: CalendarEvent[];
  children?: React.ReactNode;
  defaultDate?: Date;
  defaultView?: CalendarView;
  locale?: Locale;
  visibleViews?: CalendarView[];
}) {
  const [date, setDate] = useState(defaultDate);
  const [view, setView] = useState<CalendarView>(() => {
    // 如果默认视图不在可见视图列表中，则使用第一个可见视图
    return visibleViews.includes(defaultView) ? defaultView : visibleViews[0] || 'month';
  });

  // 当visibleViews变化且当前视图不可见时，切换到第一个可见视图
  useEffect(() => {
    if (!visibleViews.includes(view) && visibleViews.length > 0) {
      setView(visibleViews[0]);
    }
  }, [visibleViews, view]);

  const today = useCallback(() => {
    setDate(new Date());
  }, []);

  const next = useCallback(() => {
    if (view === 'day') {
      setDate((prev) => addDays(prev, 1));
    } else if (view === 'week') {
      setDate((prev) => addWeeks(prev, 1));
    } else if (view === 'month') {
      setDate((prev) => addMonths(prev, 1));
    } else if (view === 'year') {
      setDate((prev) => addYears(prev, 1));
    }
  }, [view]);

  const prev = useCallback(() => {
    if (view === 'day') {
      setDate((prev) => subDays(prev, 1));
    } else if (view === 'week') {
      setDate((prev) => subWeeks(prev, 1));
    } else if (view === 'month') {
      setDate((prev) => subMonths(prev, 1));
    } else if (view === 'year') {
      setDate((prev) => subYears(prev, 1));
    }
  }, [view]);

  useHotkeys('down', () => {
    if (view === 'day') {
      setDate((prev) => addDays(prev, 1));
    } else if (view === 'week') {
      setDate((prev) => addWeeks(prev, 1));
    } else if (view === 'month') {
      setDate((prev) => addMonths(prev, 1));
    } else if (view === 'year') {
      setDate((prev) => addYears(prev, 1));
    }
  });

  useHotkeys('up', () => {
    if (view === 'day') {
      setDate((prev) => subDays(prev, 1));
    } else if (view === 'week') {
      setDate((prev) => subWeeks(prev, 1));
    } else if (view === 'month') {
      setDate((prev) => subMonths(prev, 1));
    } else if (view === 'year') {
      setDate((prev) => subYears(prev, 1));
    }
  });

  useHotkeys('right', () => {
    if (view === 'day') {
      setDate((prev) => addDays(prev, 1));
    } else if (view === 'week') {
      setDate((prev) => addDays(prev, 1));
    } else if (view === 'month') {
      setDate((prev) => addDays(prev, 1));
    } else if (view === 'year') {
      setDate((prev) => addMonths(prev, 1));
    }
  });

  useHotkeys('left', () => {
    if (view === 'day') {
      setDate((prev) => subDays(prev, 1));
    } else if (view === 'week') {
      setDate((prev) => subDays(prev, 1));
    } else if (view === 'month') {
      setDate((prev) => subDays(prev, 1));
    } else if (view === 'year') {
      setDate((prev) => subMonths(prev, 1));
    }
  });

  // 只为可见视图添加快捷键
  useHotkeys('d', () => {
    if (visibleViews.includes('day')) {
      setView('day');
    }
  });

  useHotkeys('w', () => {
    if (visibleViews.includes('week')) {
      setView('week');
    }
  });

  useHotkeys('m', () => {
    if (visibleViews.includes('month')) {
      setView('month');
    }
  });

  useHotkeys('y', () => {
    if (visibleViews.includes('year')) {
      setView('year');
    }
  });

  useHotkeys('t', () => {
    setDate(new Date());
  });

  return (
    <CalendarContext.Provider
      value={{ date, setDate, view, setView, events, next, prev, today, locale, visibleViews }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}

export function CalendarDayView({
  date: propDate,
  locale = zhCN,
  className,
  hourHeight = 60,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  date?: Date;
  hourHeight?: number;
  locale?: Locale;
}) {
  const context = useCalendar();
  const date = propDate ?? context.date;
  const view = context.view;
  const events = context.events;
  const contextLocale = context.locale;
  const visibleViews = context.visibleViews;

  // 如果日视图不在可见视图列表中或当前视图不是日视图，则不渲染
  if (!visibleViews.includes('day') || view !== 'day') {
    return null;
  }

  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const hoursDisplay = Array.from({ length: 24 }, (_, i) => i);

  const currentDayEvents = events.filter(
    (event) => event.start >= dayStart && event.start <= dayEnd
  );

  const formatHour = (hour: number) => {
    return hour.toString().padStart(2, '0') + ':00';
  };

  const getEventPosition = (
    event: CalendarEvent
  ): { top: number; height: number } => {
    const hour = getHours(event.start);
    const minute = getMinutes(event.start);
    const durationMinutes = differenceInMinutes(event.end, event.start);

    const topPosition = hour * hourHeight + (minute / 60) * hourHeight;
    const height = (durationMinutes / 60) * hourHeight;

    return {
      top: topPosition,
      height: height,
    };
  };

  const shouldHighlightHour = (hour: number) => {
    const now = new Date();
    return (
      isSameDay(date, now) && getHours(now) === hour
    );
  };

  return (
    <div className={cn('', className)} {...props}>
      <div className="flex gap-6">
        <div className="w-20 flex flex-col">
          {hoursDisplay.map((hour) => (
            <div
              key={hour}
              className={cn(
                'h-[60px] text-right pr-2 text-sm text-muted-foreground',
                shouldHighlightHour(hour) && 'font-bold text-primary'
              )}
              style={{ height: `${hourHeight}px` }}
            >
              {formatHour(hour)}
            </div>
          ))}
        </div>
        <div className="flex-1 relative">
          {hoursDisplay.map((hour) => (
            <div
              key={hour}
              className="border-b border-muted"
              style={{ height: `${hourHeight}px` }}
            />
          ))}
          {currentDayEvents.map((event) => {
            const { top, height } = getEventPosition(event);
            return (
              <div
                key={event.id}
                className={cn(
                  'absolute w-full rounded-md p-2 border',
                  event.color === 'pink' && 'bg-pink-500/10 border-pink-500/20',
                  event.color === 'red' && 'bg-red-500/10 border-red-500/20',
                  event.color === 'green' && 'bg-green-500/10 border-green-500/20',
                  event.color === 'blue' && 'bg-blue-500/10 border-blue-500/20',
                  event.color === 'yellow' && 'bg-yellow-500/10 border-yellow-500/20',
                  event.color === 'purple' && 'bg-purple-500/10 border-purple-500/20',
                  event.color === 'indigo' && 'bg-indigo-500/10 border-indigo-500/20',
                  !event.color && 'bg-foreground/10 border-foreground/20'
                )}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                }}
              >
                <div className="text-sm font-medium">{event.title}</div>
                <div className="text-xs mt-1 text-muted-foreground">
                  {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function CalendarWeekView({
  date: propDate,
  className,
  hourHeight = 60,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  date?: Date;
  hourHeight?: number;
}) {
  const context = useCalendar();
  const date = propDate ?? context.date;
  const view = context.view;
  const events = context.events;
  const locale = context.locale;
  const visibleViews = context.visibleViews;

  // 如果周视图不在可见视图列表中或当前视图不是周视图，则不渲染
  if (!visibleViews.includes('week') || view !== 'week') {
    return null;
  }

  const startOfweek = startOfWeek(date, { locale, weekStartsOn: 1 });
  const endOfweek = endOfWeek(date, { locale, weekStartsOn: 1 });
  const hoursDisplay = Array.from({ length: 24 }, (_, i) => i);

  const days = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfweek, i)
  );

  const formatHour = (hour: number) => {
    return hour.toString().padStart(2, '0') + ':00';
  };

  const formatWeekDay = (date: Date) => {
    return format(date, 'EEE', { locale });
  };

  const getEventPosition = (
    event: CalendarEvent,
    day: Date
  ): { top: number; height: number } | null => {
    if (!isSameDay(event.start, day)) return null;

    const hour = getHours(event.start);
    const minute = getMinutes(event.start);
    const durationMinutes = differenceInMinutes(event.end, event.start);

    const topPosition = hour * hourHeight + (minute / 60) * hourHeight;
    const height = (durationMinutes / 60) * hourHeight;

    return {
      top: topPosition,
      height: height,
    };
  };

  const shouldHighlightHour = (hour: number, day: Date) => {
    const now = new Date();
    return (
      isSameDay(day, now) && getHours(now) === hour
    );
  };

  return (
    <div className={cn('', className)} {...props}>
      <div className="flex gap-1">
        <div className="w-20" />
        {days.map((day, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 h-[30px] text-center text-sm',
              isToday(day) && 'text-primary font-bold'
            )}
          >
            <div>{formatWeekDay(day)}</div>
            <div>{format(day, 'd')}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-2">
        <div className="w-20 flex flex-col">
          {hoursDisplay.map((hour) => (
            <div
              key={hour}
              className={'h-[60px] text-right pr-2 text-sm text-muted-foreground'}
              style={{ height: `${hourHeight}px` }}
            >
              {formatHour(hour)}
            </div>
          ))}
        </div>
        {days.map((day, dayIndex) => (
          <div key={dayIndex} className="flex-1 relative">
            {hoursDisplay.map((hour) => (
              <div
                key={hour}
                className={cn(
                  'border-b border-muted',
                  shouldHighlightHour(hour, day) && 'bg-primary/5'
                )}
                style={{ height: `${hourHeight}px` }}
              />
            ))}
            {events.map((event) => {
              const position = getEventPosition(event, day);
              if (!position) return null;
              const { top, height } = position;
              return (
                <div
                  key={event.id}
                  className={cn(
                    'absolute w-full rounded-md p-1',
                    event.color === 'pink' && 'bg-pink-500/10 border-pink-500/20',
                    event.color === 'red' && 'bg-red-500/10 border-red-500/20',
                    event.color === 'green' && 'bg-green-500/10 border-green-500/20',
                    event.color === 'blue' && 'bg-blue-500/10 border-blue-500/20',
                    event.color === 'yellow' && 'bg-yellow-500/10 border-yellow-500/20',
                    event.color === 'purple' && 'bg-purple-500/10 border-purple-500/20',
                    event.color === 'indigo' && 'bg-indigo-500/10 border-indigo-500/20',
                    !event.color && 'bg-foreground/10 border-foreground/20'
                  )}
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                  }}
                >
                  <div className="text-xs font-medium truncate">{event.title}</div>
                  {height > 30 && (
                    <div className="text-[10px] text-muted-foreground truncate">
                      {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CalendarMonthView({
  date: propDate,
  className,
  onDayClick,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  date?: Date;
  onDayClick?: (day: Date) => void;
}) {
  const context = useCalendar();
  const date = propDate ?? context.date;
  const view = context.view;
  const events = context.events;
  const locale = context.locale;
  const setDate = context.setDate;
  const setView = context.setView;
  const visibleViews = context.visibleViews;

  // 如果月视图不在可见视图列表中或当前视图不是月视图，则不渲染
  if (!visibleViews.includes('month') || view !== 'month') {
    return null;
  }

  const startOfCurrntMonth = startOfMonth(date);
  const endOfCurrentMonth = endOfMonth(date);
  const startDate = startOfWeek(startOfCurrntMonth, { locale, weekStartsOn: 1 });
  const endDate = endOfWeek(endOfCurrentMonth, { locale, weekStartsOn: 1 });

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  // Calendar data by week
  const calendarData = [];
  let week = [];

  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      calendarData.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    calendarData.push(week);
  }

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.start, day));
  };

  const isInCurrentMonth = (day: Date) => {
    return isSameMonth(day, date);
  };

  const formatWeekDay = (day: number) => {
    const dayNames = {
      0: '周日',
      1: '周一',
      2: '周二',
      3: '周三',
      4: '周四',
      5: '周五',
      6: '周六'
    };
    return dayNames[day as keyof typeof dayNames];
  };

  const handleDayClick = (day: Date) => {
    setDate(day);
    if (onDayClick) {
      onDayClick(day);
    } else {
      setView('day');
    }
  };

  const days_of_week = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className={cn('', className)} {...props}>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {days_of_week.map((day, i) => (
          <div key={i} className="text-center text-sm text-muted-foreground h-8 flex items-center justify-center">
            {formatWeekDay(day)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarData.flat().map((day, i) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isInCurrentMonth(day);
          return (
            <Button
              key={i}
              variant="ghost"
              className={cn(
                'h-auto min-h-[100px] p-2 font-normal flex flex-col items-start justify-start',
                !isCurrentMonth && 'text-muted-foreground',
                isToday(day) && 'bg-primary/10'
              )}
              onClick={() => handleDayClick(day)}
            >
              <div className="w-full flex flex-col">
                <div className="flex justify-start mb-2">
                  <div
                    className={cn(
                      'w-6 h-6 flex items-center justify-center',
                      !isCurrentMonth && 'text-muted-foreground',
                      isToday(day) && 'bg-primary text-primary-foreground rounded-full'
                    )}
                  >
                    {format(day, 'd')}
                  </div>
                </div>
                <div className="space-y-1 w-full">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        'text-xs rounded w-full text-left truncate px-1',
                        event.color === 'pink' && 'bg-pink-500/10 text-pink-700 dark:text-pink-500',
                        event.color === 'red' && 'bg-red-500/10 text-red-700 dark:text-red-500',
                        event.color === 'green' && 'bg-green-500/10 text-green-700 dark:text-green-500',
                        event.color === 'blue' && 'bg-blue-500/10 text-blue-700 dark:text-blue-500',
                        event.color === 'yellow' && 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-500',
                        event.color === 'purple' && 'bg-purple-500/10 text-purple-700 dark:text-purple-500',
                        event.color === 'indigo' && 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-500',
                        !event.color && 'bg-primary/10 text-primary'
                      )}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      + {dayEvents.length - 3} more
                    </div>
                  )}
                  {dayEvents.length === 0 && <div className="h-4"></div>}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export function CalendarYearView({
  date: propDate,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  date?: Date;
}) {
  const context = useCalendar();
  const date = propDate ?? context.date;
  const view = context.view;
  const events = context.events;
  const locale = context.locale;
  const setDate = context.setDate;
  const setView = context.setView;
  const visibleViews = context.visibleViews;

  // 如果年视图不在可见视图列表中或当前视图不是年视图，则不渲染
  if (!visibleViews.includes('year') || view !== 'year') {
    return null;
  }

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(getYear(date), i, 1)
  );

  const formatMonth = (date: Date) => {
    return format(date, 'MMMM', { locale });
  };

  const getEventsCountForMonth = (month: Date) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    return events.filter((event) => event.start >= start && event.start <= end).length;
  };

  const handleMonthClick = (month: Date) => {
    setDate(month);
    setView('month');
  };

  return (
    <div
      className={cn('grid grid-cols-3 md:grid-cols-4 gap-4', className)}
      {...props}
    >
      {months.map((month, i) => {
        const isCurrentMonth = isSameMonth(month, new Date());
        const eventsCount = getEventsCountForMonth(month);
        return (
          <Button
            key={i}
            variant="ghost"
            className={cn(
              'h-auto p-4 font-normal',
              isCurrentMonth && 'bg-primary/10'
            )}
            onClick={() => handleMonthClick(month)}
          >
            <div className="w-full flex flex-col items-center space-y-2">
              <div className="text-xl">{formatMonth(month)}</div>
              {eventsCount > 0 && (
                <div className="text-xs text-muted-foreground">
                  {eventsCount} events
                </div>
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );
}

export function CalendarViewTrigger({
  view,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  view: CalendarView;
}) {
  const context = useCalendar();
  const currentView = context.view;
  const setView = context.setView;
  const visibleViews = context.visibleViews;

  // 如果视图不在可见视图列表中，则不渲染此按钮
  if (!visibleViews.includes(view)) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      aria-current={currentView === view}
      {...props}
      className={cn(className)}
      onClick={() => setView(view)}
    >
      {children}
    </Button>
  );
}

export function CalendarDateRange({
  date: propDate,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  date?: Date;
}) {
  const context = useCalendar();
  const date = propDate ?? context.date;
  const view = context.view;
  const locale = context.locale;

  let content;

  if (view === 'day') {
    if (isToday(date)) {
      content = '今天';
    } else if (isYesterday(date)) {
      content = '昨天';
    } else if (isTomorrow(date)) {
      content = '明天';
    } else {
      content = format(date, 'PPP', { locale });
    }
  } else if (view === 'week') {
    const startOfweek = startOfWeek(date, { locale, weekStartsOn: 1 });
    const endOfweek = endOfWeek(date, { locale, weekStartsOn: 1 });
    content = `${format(startOfweek, 'PP', { locale })} - ${format(
      endOfweek,
      'PP',
      { locale }
    )}`;
  } else if (view === 'month') {
    content = format(date, 'LLLL yyyy', { locale });
  } else if (view === 'year') {
    content = format(date, 'yyyy', { locale });
  }

  return (
    <div {...props} className={cn('text-sm', props.className)}>
      {content}
    </div>
  );
}

export function CalendarCurrentDate({
  date: propDate,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  date?: Date;
}) {
  const context = useCalendar();
  const date = propDate ?? context.date;
  const view = context.view;
  const locale = context.locale;

  let content;

  if (view === 'day') {
    content = format(date, 'PPP', { locale });
  } else if (view === 'week') {
    const startOfweek = startOfWeek(date, { locale, weekStartsOn: 1 });
    const endOfweek = endOfWeek(date, { locale, weekStartsOn: 1 });
    content = `${format(startOfweek, 'LLL dd', { locale })} - ${format(
      endOfweek,
      'LLL dd, yyyy',
      { locale }
    )}`;
  } else if (view === 'month') {
    content = format(date, 'LLLL yyyy', { locale });
  } else if (view === 'year') {
    content = format(date, 'yyyy', { locale });
  }

  return (
    <div {...props} className={cn('font-medium text-sm', props.className)}>
      {content}
    </div>
  );
}

export function CalendarPrevTrigger({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = useCalendar();
  const prev = context.prev;

  return (
    <Button variant="ghost" size="icon" {...props} onClick={prev}>
      {props.children}
    </Button>
  );
}

export function CalendarNextTrigger({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = useCalendar();
  const next = context.next;

  return (
    <Button variant="ghost" size="icon" {...props} onClick={next}>
      {props.children}
    </Button>
  );
}

export function CalendarTodayTrigger({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = useCalendar();
  const today = context.today;

  return (
    <Button variant="ghost" size="sm" onClick={today} {...props}>
      {props.children}
    </Button>
  );
}