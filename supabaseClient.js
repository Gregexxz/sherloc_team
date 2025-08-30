// js/supabaseClient.js (Versão Corrigida)

const SUPABASE_URL = 'https://vtiskeajhcdykrdafxax.supabase.co'; // Sua URL está correta
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0aXNrZWFqaGNkeWtyZGFmeGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MzA3NjcsImV4cCI6MjA3MjAwNjc2N30.VAGvBk8-SHcZtURRaVlbCzlE1WdFVZwFffid_SOcZOU'; // Sua chave está correta

// A CORREÇÃO ESTÁ AQUI: Usamos "window.supabase" para acessar o objeto global
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);