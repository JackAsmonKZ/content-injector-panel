import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import type { Campaign } from "../../types";

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setCampaigns(data as Campaign[]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreate = async () => {
    setSaving(true);
    const { data, error } = await supabase
      .from("campaigns")
      .insert([{ name: newName }])
      .select();
    setSaving(false);
    if (error) return alert("Ошибка создания кампании!");
    setCreateOpen(false);
    setNewName("");
    if (data && data[0]?.id) {
      fetchCampaigns();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("campaigns").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchCampaigns();
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Список кампаний
      </Typography>
      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => setCreateOpen(true)}
      >
        Создать кампанию
      </Button>

      <Grid container spacing={2}>
        {isLoading && campaigns.length === 0 && <CircularProgress />}
        {campaigns.map((campaign) => (
          <Grid key={campaign.id} sx={{ mb: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{campaign.name}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Создано: {new Date(campaign.created_at).toLocaleDateString()}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/campaign/${campaign.id}`)}
                  >
                    Перейти
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => setDeleteId(campaign.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Диалог создания кампании */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        slotProps={{
          transition: {
            onEntered: () => {
              inputRef.current?.focus();
            },
          },
        }}
      >
        <DialogTitle>Создать кампанию</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Название кампании"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fullWidth
              inputRef={inputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !!newName.trim() && !saving) {
                  handleCreate();
                }
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Отмена</Button>
          <Button
            onClick={handleCreate}
            disabled={!newName.trim() || saving}
            variant="contained"
          >
            Создать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Удалить кампанию?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Отмена</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
