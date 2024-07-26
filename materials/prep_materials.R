# goes from mildly (hand) formatted copy of A&S materials from appendix to pre-maze format

library(tidyverse)
library(here)

labs <- function(n){
  return(seq(n) |> str_c(collapse=" "))
}
d <- read_delim(here("materials/altmann-materials")) |>
  mutate(subtype = case_when(
    type == "setup" ~ 1,
    type == "1-context" | type == "2-context" ~ 2,
    type == "NP" | type == "VP" ~ 3
  )) |>
  mutate(item_num = str_c(item_num, "_", subtype)) |>
  select(-subtype) |> 
  mutate(m = str_count(sentence, "\\S+"),
         labels=map_chr(m, labs))
  

# determine which ones have misaligned words
d |>
  select(item_num, m) |>
  unique() |>
  group_by(item_num) |> 
  tally() |> 
  filter(n>1)

d |> select(type, item_num, sentence, labels) |> write_delim(here("materials/pre_maze1.csv"), delim=";",col_names=F)

# post-maze --> js format
library(jsonlite)

foo <- read_delim(here("materials/post_maze.txt"), col_names = F) |> 
  rename(type=X1, item=X2, correct=X3, distractor=X4) |> select(-X5) |>
  separate(item, c("item", "sent")) |> 
  write_json(here("experiment/src/stimuli1.js"))
