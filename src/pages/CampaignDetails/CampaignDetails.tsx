import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Box,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WhitelistDomains from "../../components/WhitelistDomains/WhitelistDomains";
import styles from "./CampaignDetails.module.scss";
import { VALID_KEY_REGEX } from "../../constants";
import type { Campaign } from "../../types";

interface Injectable {
  id: string;
  campaign_id: string;
  key: string;
  type: string;
  value: string;
  created_at: string;
}

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [injectables, setInjectables] = useState<Injectable[]>([]);
  const [newInjectable, setNewInjectable] = useState({
    key: "",
    type: "",
    value: "",
  });
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Injectable | null>(null);
  const [editData, setEditData] = useState({
    key: "",
    type: "",
    value: "",
  });
  const [keyError, setKeyError] = useState<string>("");
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  const isValidKey = (key: string) => VALID_KEY_REGEX.test(key);

  const fetchInjectables = async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from("injectables")
      .select("*")
      .eq("campaign_id", id)
      .order("created_at", { ascending: true });
    if (error) console.error(error);
    else setInjectables(data as Injectable[]);
  };

  useEffect(() => {
    fetchInjectables();
    // eslint-disable-next-line
  }, [id]);

  const handleAddInjectable = async () => {
    if (
      !id ||
      !newInjectable.key ||
      !newInjectable.type ||
      !newInjectable.value
    )
      return;
    const { error } = await supabase.from("injectables").insert([
      {
        campaign_id: id,
        key: newInjectable.key,
        type: newInjectable.type,
        value: newInjectable.value,
      },
    ]);
    if (error) alert("Ошибка добавления!");
    setNewInjectable({ key: "", type: "", value: "" });
    fetchInjectables();
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !id) return;
    setUploading(true);
    const file = e.target.files[0];
    const filePath = `${id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      setUploading(false);
      alert("Ошибка загрузки файла: " + uploadError.message);
      return;
    }
    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    setNewInjectable((prev) => ({ ...prev, value: data.publicUrl }));
    setUploading(false);
  };

  const handleEditUploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || !e.target.files[0] || !id) return;
    setUploading(true);
    const file = e.target.files[0];
    const filePath = `${id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      setUploading(false);
      alert("Ошибка загрузки файла: " + uploadError.message);
      return;
    }
    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    setEditData((prev) => ({ ...prev, value: data.publicUrl }));
    setUploading(false);
  };

  const handleDelete = async (injId: string) => {
    await supabase.from("injectables").delete().eq("id", injId);
    fetchInjectables();
  };

  const handleEdit = (inj: Injectable) => {
    setEditing(inj);
    setEditData({ key: inj.key, type: inj.type, value: inj.value });
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    const { error } = await supabase
      .from("injectables")
      .update({
        key: editData.key,
        type: editData.type,
        value: editData.value,
      })
      .eq("id", editing.id);
    if (error) alert("Ошибка обновления!");
    setEditing(null);
    setEditData({ key: "", type: "", value: "" });
    fetchInjectables();
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setEditData({ key: "", type: "", value: "" });
  };

  useEffect(() => {
    if (!id) return;
    supabase
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => setCampaign(data));
  }, [id]);

  return (
    <>
      <Box sx={{ p: 3 }} position={"relative"}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          {campaign?.name || "Кампания"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          ID: {id}
        </Typography>
        {id && <WhitelistDomains campaignId={id} />}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Добавить подмену
            </Typography>
            <Stack spacing={2} direction="row" alignItems={"center"}>
              <TextField
                label="Ключ"
                size="small"
                value={newInjectable.key}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewInjectable({ ...newInjectable, key: val });
                  if (val && !isValidKey(val)) {
                    setKeyError("Только латинские буквы, цифры, - и _");
                  } else {
                    setKeyError("");
                  }
                }}
                error={!!keyError}
                helperText={keyError}
              />

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="type-label">Тип</InputLabel>
                <Select
                  labelId="type-label"
                  label="Тип"
                  value={newInjectable.type}
                  onChange={(e) =>
                    setNewInjectable({
                      ...newInjectable,
                      type: e.target.value as string,
                      value: "",
                    })
                  }
                >
                  <MenuItem value="text">Текст</MenuItem>
                  <MenuItem value="image">Изображение</MenuItem>
                </Select>
              </FormControl>
              {newInjectable.type === "image" ? (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  style={{ alignItems: "center" }}
                >
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    disabled={uploading}
                  >
                    {uploading ? <CircularProgress size={18} /> : "Загрузить"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleUploadImage}
                    />
                  </Button>
                  <TextField
                    size="small"
                    label="Ссылка на изображение"
                    value={newInjectable.value}
                    sx={{ minWidth: 240 }}
                  />
                </Stack>
              ) : (
                <TextField
                  label="Текст"
                  size="small"
                  value={newInjectable.value}
                  onChange={(e) =>
                    setNewInjectable({
                      ...newInjectable,
                      value: e.target.value,
                    })
                  }
                  sx={{ minWidth: 240 }}
                />
              )}
              <Button
                variant="contained"
                onClick={handleAddInjectable}
                disabled={
                  !newInjectable.key ||
                  !newInjectable.type ||
                  !newInjectable.value ||
                  uploading ||
                  !!keyError
                }
                style={{ minWidth: "unset" }}
              >
                +
              </Button>
            </Stack>
          </CardContent>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Список подмен
            </Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ключ</TableCell>
                  <TableCell>Тип</TableCell>
                  <TableCell>Значение</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {injectables.map((inj) => (
                  <TableRow key={inj.id}>
                    <TableCell>{inj.key}</TableCell>
                    <TableCell>{inj.type}</TableCell>
                    <TableCell>
                      {inj.type === "image" ? (
                        <a
                          href={inj.value}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {inj.value}
                        </a>
                      ) : (
                        inj.value
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(inj)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(inj.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={!!editing} onClose={handleCancelEdit}>
          <DialogTitle>Редактировать подмену</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Ключ"
                size="small"
                value={editData.key}
                onChange={(e) =>
                  setEditData({ ...editData, key: e.target.value })
                }
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="edit-type-label">Тип</InputLabel>
                <Select
                  labelId="edit-type-label"
                  label="Тип"
                  value={editData.type}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      type: e.target.value as string,
                      value: "",
                    })
                  }
                >
                  <MenuItem value="text">Текст</MenuItem>
                  <MenuItem value="image">Изображение</MenuItem>
                </Select>
              </FormControl>
              {editData.type === "image" ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    disabled={uploading}
                  >
                    {uploading ? <CircularProgress size={18} /> : "Загрузить"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleEditUploadImage}
                    />
                  </Button>
                  <TextField
                    size="small"
                    label="Ссылка на изображение"
                    value={editData.value}
                    sx={{ minWidth: 240 }}
                  />
                </Stack>
              ) : (
                <TextField
                  label="Текст"
                  size="small"
                  value={editData.value}
                  onChange={(e) =>
                    setEditData({ ...editData, value: e.target.value })
                  }
                  sx={{ minWidth: 240 }}
                />
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelEdit}>Отмена</Button>
            <Button
              variant="contained"
              onClick={handleSaveEdit}
              disabled={
                !editData.key || !editData.type || !editData.value || uploading
              }
            >
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </Box>
    </>
  );
};

export default CampaignDetails;
