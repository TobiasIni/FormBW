"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { supabase, type Submission } from "@/lib/supabase"
import { Users, TrendingUp, Calendar, Mail } from "lucide-react"

export default function AdminPanel() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
  })

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      console.log("Cargando participaciones...")
      const { data, error } = await supabase.from("submissions").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching submissions:", error)
        setSubmissions([])
      } else {
        console.log("Participaciones cargadas:", data?.length || 0)
        setSubmissions(data || [])
        calculateStats(data || [])
      }
    } catch (err) {
      console.error("Error de conexión:", err)
      setSubmissions([])
    }
    setLoading(false)
  }

  const calculateStats = (data: Submission[]) => {
    if (data.length === 0) {
      setStats({ total: 0, averageScore: 0, highestScore: 0, lowestScore: 0 })
      return
    }

    const scores = data.map((s) => s.total_score)
    const total = data.length
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / total
    const highestScore = Math.max(...scores)
    const lowestScore = Math.min(...scores)

    setStats({
      total,
      averageScore: Math.round(averageScore * 100) / 100,
      highestScore,
      lowestScore,
    })
  }

  const getScoreBadge = (score: number) => {
    const maxScore = 20 // 5 preguntas * 4 puntos máximo
    const percentage = (score / maxScore) * 100

    if (percentage >= 80) {
      return <Badge className="bg-yellow-500">Excelente</Badge>
    } else if (percentage >= 60) {
      return <Badge className="bg-blue-500">Muy Bien</Badge>
    } else if (percentage >= 40) {
      return <Badge className="bg-green-500">Bien</Badge>
    } else {
      return <Badge className="bg-purple-500">Principiante</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Cargando datos del panel de administración...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">Gestiona y visualiza todas las participaciones del quiz</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Participaciones</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Puntuación Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Puntuación Más Alta</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.highestScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Puntuación Más Baja</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.lowestScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de participaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Todas las Participaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Puntuación</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Respuestas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.email}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{submission.total_score}</span>
                      <span className="text-gray-500 ml-1">/ 20</span>
                    </TableCell>
                    <TableCell>{getScoreBadge(submission.total_score)}</TableCell>
                    <TableCell className="text-gray-600">{formatDate(submission.created_at)}</TableCell>
                    <TableCell>
                      <details className="cursor-pointer">
                        <summary className="text-blue-600 hover:text-blue-800">Ver respuestas</summary>
                        <div className="mt-2 text-sm text-gray-600">
                          {submission.answers.map((answer, index) => (
                            <div key={index} className="mb-1">
                              Pregunta {answer.questionId}: Opción {answer.selectedOption + 1}
                              <span className="text-green-600 ml-1">(+{answer.score} pts)</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {submissions.length === 0 && (
              <div className="text-center py-8 text-gray-500">No hay participaciones aún</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
