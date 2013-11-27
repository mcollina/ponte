#! /usr/bin/env Rscript

args <- commandArgs(TRUE)
preFiles <- 1
output <- args[1]

#colors <- topo.colors(length(args) - preFiles)
#colors <- gray(1:(length(args) - preFiles) / (length(args) - preFiles + 1))
colors <- rainbow(length(args) - preFiles)
#lines <- c("311311", "33", "4242", "22") #2:6 #c(2, 4, 6, 1, 3)
lines <- 1
totalFiles <- (preFiles + 1):length(args)
pch <- 1:(length(args) - preFiles)


frames <- Map(function(file) { 
  frame <- read.csv(file, header=TRUE)
  frame
}, args[totalFiles])

data <- Reduce(function(acc, frame) {
  result <- merge(acc, frame)
  result
}, frames)

print(colnames(data))
data <- subset(data, select=-c(1))

columns <- factor(colnames(data))

quartz("Ponte")
matplot(data,
        type="l",
        lty=lines,
        col=colors,
        ylim=c(0, 16000),
        cex.lab=1.5,
        lwd=5,
        xlab="messages", ylab="milliseconds")

legend("topleft",
       legend=columns,
       cex=1.5,
       col=colors, lty=lines, lwd=5)

dev.copy(pdf,output)
dev.off()

message("Press Return To Continue")
invisible(readLines("stdin", n=1))
