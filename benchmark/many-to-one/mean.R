#! /usr/bin/env Rscript

args <- commandArgs(TRUE)

output <- args[1]
name <- args[2]

frames <- Map(function(file) { 
  frame <- read.csv(file, header=FALSE)
  valueName <- paste(file, 'value')
  if (length(frame) == 1) {
    reframe <- data.frame(sample=1:nrow(frame))
    reframe[valueName] <- frame[1]
    frame <- reframe
  } else if (length(frame) == 2) {
    colnames(frame) <- c('sample', valueName)
  }
  frame
}, args[3:length(args)])

data <- Reduce(function(acc, frame) {
  merge(acc, frame)
}, frames)

data <- subset(data, select=-c(1))
data <- apply(data, 1, mean)
data <- data.frame(1:length(data), data)

colnames(data) <- c("sample", name)

write.csv(data, file=output, row.names=FALSE, quote=FALSE)
