<template>
  <div class="container mt-4">
    <div class="card" style="border: 2px solid #C09C6A; border-radius: 20px; background-color:#FFF3DB;">
      <div class="card-body p-4">
        <div ref="calendarContainer"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const calendarContainer = ref(null)
let calendar = null

onMounted(() => {
  if (!calendarContainer.value) return
  
  calendar = new FullCalendar.Calendar(calendarContainer.value, {
    locale: 'ru',
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    buttonText: {
      today: 'Сегодня',
      month: 'Месяц',
      week: 'Неделя'
    },
    height: 'auto',
    firstDay: 1,
    displayEventTime: false,
    events: async (info, successCallback) => {
      try {
        const response = await axios.get('/api/CalendarApi', {
          params: { 
            start: info.startStr, 
            end: info.endStr 
          }
        })
        
        const events = response.data
          .filter(event => event && event.start !== null)
          .map(event => ({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            extendedProps: {
              number: event.number,
              organizationUnit: event.organizationUnit,
              route: event.route,
              driverName: event.driverName,
              statusName: event.statusName,
              statusColor: event.color
            }
          }))
        
        successCallback(events)
      } catch (error) {
        console.error('Ошибка загрузки:', error)
        successCallback([])
      }
    },
    eventDidMount: (info) => {
      // Кастомная отрисовка с кружочком
      const statusColor = info.event.extendedProps.statusColor || '#6c757d'
      const eventTitle = info.event.title
      
      // Очищаем стандартное содержимое
      while (info.el.firstChild) {
        info.el.removeChild(info.el.firstChild)
      }
      
      // Убираем фон и边框
      info.el.style.backgroundColor = 'transparent'
      info.el.style.border = 'none'
      info.el.style.display = 'flex'
      info.el.style.alignItems = 'center'
      info.el.style.padding = '0'
      
      // Создаем обертку
      const wrapper = document.createElement('div')
      wrapper.style.display = 'flex'
      wrapper.style.alignItems = 'center'
      wrapper.style.gap = '8px'
      wrapper.style.padding = '4px 8px'
      wrapper.style.width = '100%'
      
      // Создаем кружочек
      const circle = document.createElement('div')
      circle.style.width = '8px'
      circle.style.height = '8px'
      circle.style.borderRadius = '50%'
      circle.style.backgroundColor = statusColor
      circle.style.flexShrink = '0'
      
      // Создаем текст
      const text = document.createElement('span')
      text.style.color = '#010047'
      text.style.fontSize = '11px'
      text.style.fontWeight = '450'
      text.style.overflow = 'hidden'
      text.style.textOverflow = 'ellipsis'
      text.style.whiteSpace = 'nowrap'
      text.style.flex = '1'
      text.textContent = eventTitle
      
      wrapper.appendChild(circle)
      wrapper.appendChild(text)
      info.el.appendChild(wrapper)
      
      // Добавляем подсказку
      info.el.title = `${info.event.extendedProps.statusName || ''}: ${eventTitle}`
    },
    eventClick: (info) => {
      const event = info.event
      alert(`Заявка ${event.extendedProps.number}\n` +
        `Организация: ${event.extendedProps.organizationUnit || '—'}\n` +
        `Маршрут: ${event.extendedProps.route || '—'}\n` +
        `Водитель: ${event.extendedProps.driverName || 'не назначен'}\n` +
        `Статус: ${event.extendedProps.statusName || '—'}`)
    }
  })
  
  calendar.render()
  console.log('Календарь создан')
})
</script>

<style scoped>
.card {
  border: 2px solid #C09C6A;
  border-radius: 20px;
  background-color: #FFF3DB;
}

:deep(.fc) {
  background: #FFF3DB;
  font-family: 'Roboto', sans-serif !important;
}

:deep(.fc .fc-toolbar-title) {
  color: #010047;
  font-size: 24px;
  font-weight: 450;
}

:deep(.fc .fc-button) {
  background-color: #008EB9 !important;
  border: none !important;
  border-radius: 15px !important;
  padding: 8px 16px !important;
  font-weight: 450 !important;
  transition: all 0.3s ease !important;
}

:deep(.fc .fc-button:hover) {
  background-color: #006688 !important;
  transform: translateY(-2px);
}

:deep(.fc .fc-button-active) {
  background-color: #006688 !important;
  border: 2px solid #C09C6A !important;
}

:deep(.fc .fc-col-header-cell) {
  background-color: #008EB9 !important;
}

:deep(.fc .fc-col-header-cell-cushion) {
  color: white !important;
  font-weight: 450 !important;
  padding: 12px 0 !important;
}

:deep(.fc .fc-daygrid-day) {
  background-color: #FFF3DB !important;
  border: 1px solid #C09C6A !important;
}

:deep(.fc .fc-daygrid-day-frame) {
  display: flex;
  flex-direction: column;
  height: 100% !important;
}

:deep(.fc .fc-daygrid-day:hover) {
  background-color: #FFE8CD !important;
}

:deep(.fc .fc-daygrid-day-number) {
  color: #010047 !important;
  font-weight: 450 !important;
  padding: 8px !important;
}

:deep(.fc-day-today) {
  background-color: #FFE8CD !important;
  border: 2px solid #C09C6A !important;
}

:deep(.fc-day-today .fc-daygrid-day-number) {
  color: #008EB9 !important;
}

:deep(.fc-day-sat .fc-daygrid-day-number),
:deep(.fc-day-sun .fc-daygrid-day-number) {
  color: #C09C6A !important;
}

:deep(.fc-event) {
  margin: 2px 3px !important;
  border-radius: 12px !important;
  cursor: pointer !important;
  background-color: transparent !important;
}

:deep(.fc-event:hover) {
  transform: scale(1.02);
  background-color: rgba(0, 142, 185, 0.1) !important;
}

:deep(.fc-daygrid-day-events) {
  width: 100% !important;
  overflow-x: hidden !important;
  padding: 2px 3px !important;
  box-sizing: border-box !important;
}

@media (max-width: 768px) {
  :deep(.fc-header-toolbar) {
    flex-direction: column;
    align-items: stretch;
  }
  
  :deep(.fc .fc-toolbar-chunk) {
    justify-content: center;
  }
  
  :deep(.fc .fc-button-group) {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>