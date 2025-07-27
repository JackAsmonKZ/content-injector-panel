import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const WhitelistDomains = ({ campaignId }: { campaignId: string }) => {
  const [domains, setDomains] = useState<{ id: string; domain: string }[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [isDomainLoading, setIsDomainLoading] = useState(false);

  const fetchDomains = async () => {
    const { data, error } = await supabase
      .from("whitelist_domains")
      .select("id, domain")
      .eq("campaign_id", campaignId);
    if (error) console.error(error);
    else setDomains(data);
  };

  useEffect(() => {
    if (campaignId) fetchDomains();
    // eslint-disable-next-line
  }, [campaignId]);

  const handleAddDomain = async () => {
    setIsDomainLoading(true);
    if (!newDomain.trim()) return;
    const { error } = await supabase
      .from("whitelist_domains")
      .insert([{ campaign_id: campaignId, domain: newDomain.trim() }]);
    if (error) alert("Ошибка добавления!");
    setNewDomain("");
    fetchDomains();
    setIsDomainLoading(false);
  };

  const handleDeleteDomain = async (id: string) => {
    await supabase.from("whitelist_domains").delete().eq("id", id);
    fetchDomains();
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Whitelist домены
        </Typography>
        <Stack direction="row" spacing={2} mb={2}>
          <TextField
            label="Домен"
            size="small"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="example.com"
          />
          <Button
            variant="contained"
            onClick={handleAddDomain}
            style={{ minWidth: "unset" }}
            disabled={!newDomain || isDomainLoading}
          >
            +
          </Button>
        </Stack>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Домен</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {domains.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.domain}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteDomain(row.id)}
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
  );
};

export default WhitelistDomains;
