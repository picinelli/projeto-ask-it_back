import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useAlert from "../hooks/useAlert";
import { MenuItem, Box, Button, Divider, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api, { Category, Discipline, Teacher, Test } from "../services/api";
import Form from "../components/Form";

export type TestData = {
  name: string;
  pdfUrl: string;
  categoryId: number | "";
  teacherId: number | "";
  disciplineId: number | "";
};

export default function AdicionarTeste() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { setMessage } = useAlert();
  const [disabled, setDisabled] = useState(true)
  const [categories, setCategories] = useState<Category[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [teachers, setTeachers] = useState<any>([]);
  const [formData, setFormData] = useState<TestData>({
    name: "",
    pdfUrl: "",
    categoryId: "",
    teacherId: "",
    disciplineId: "",
  });

  async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(e.target.name === "disciplineId") {
      const {data: teachersData} = await api.getTeachersByDisciplineId(token, e.target.value)
      if(teachersData.teachers.length > 0) {
        setTeachers(teachersData.teachers);
        setDisabled(false)
      } else {
        setDisabled(true)
      }
    }
  }

  useEffect(() => {
    async function loadPage() {
      if (!token) return;
      const { data: categoriesData } = await api.getCategories(token);
      setCategories(categoriesData.categories);

      const { data: disciplinesData } = await api.getDisciplines(token);
      setDisciplines(disciplinesData.disciplines);
    }
    loadPage();
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.postTest(token, formData);
      setMessage({ type: "success", text: "Prova criada com sucesso!" });
    } catch(e) {
      setMessage({ type: "error", text: "Todos os campos são obrigatórios!" });
    }
  }

  return (
    <>
      <TextField
        sx={{ marginX: "auto", marginBottom: "25px", width: "450px" }}
        label="Pesquise por disciplina"
      />
      <Divider sx={{ marginBottom: "35px" }} />
      <Box
        sx={{
          marginX: "auto",
          width: "700px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate("/app/disciplinas")}
          >
            Disciplinas
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/app/pessoas-instrutoras")}
          >
            Pessoa Instrutora
          </Button>
          <Button variant="outlined" onClick={() => navigate("/app/adicionar")}>
            Adicionar
          </Button>
        </Box>
        <Box sx={{ marginTop: "50px" }}>
        <Form onSubmit={handleSubmit}>
          <TextField
            name="name"
            sx={{
              marginTop: "15px",
              width: "700px",
            }}
            id="standard-basic"
            label="Nome da Prova"
            onChange={handleInputChange}
            value={formData.name}
          >
            <MenuItem value="10">Ten</MenuItem>
            <MenuItem value="20">Twenty</MenuItem>
          </TextField>
          <TextField
            name="pdfUrl"
            sx={{
              marginTop: "15px",
              width: "700px",
            }}
            id="standard-basic"
            label="Link da Prova"
            onChange={handleInputChange}
            value={formData.pdfUrl}
          >
          </TextField>
          <TextField
            name="categoryId"
            sx={{
              marginTop: "15px",
              width: "700px",
            }}
            id="select"
            label="Categoria"
            onChange={handleInputChange}
            value={formData.categoryId}
            select
          >
            {categories.map((e) => {
              return (
                <MenuItem key={e.id} value={e.id}>
                  {e.name}
                </MenuItem>
              );
            })}
          </TextField>
          <TextField
            name="disciplineId"
            sx={{
              marginTop: "15px",
              width: "700px",
            }}
            id="select"
            label="Disciplina"
            onChange={handleInputChange}
            value={formData.disciplineId}
            select
          >
            {disciplines.map((e) => {
              return (
                <MenuItem key={e.id} value={e.id}>
                  {e.name}
                </MenuItem>
              );
            })}
          </TextField>
          <TextField
            name="teacherId"
            sx={{
              marginTop: "15px",
              width: "700px",
            }}
            id="select"
            label="Pessoa Instrutora"
            onChange={handleInputChange}
            value={formData.teacherId}
            disabled={disabled}
            select
          >
            {teachers.map((e:any) => {
              return (
                <MenuItem key={e.teacher.id} value={e.teacher.id}>
                  {e.teacher.name}
                </MenuItem>
              );
            })}
          </TextField>
          <Button
            sx={{
              marginTop: "15px",
              width: "700px",
            }}
            variant="contained"
            type="submit"
          >
            Enviar
          </Button>
        </Form>
        </Box>
      </Box>
    </>
  );
}
